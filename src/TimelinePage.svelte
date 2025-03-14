<script lang="ts">
  import { t } from 'svelte-i18n';
  import { Link } from 'svelte-routing';
  import ChevronBack from 'svelte-ionicons/ChevronBackOutline.svelte';
  import { format as formatDate, parseISO, differenceInDays } from 'date-fns';
  import patchNotesStatsJSON from '$assets/PatchNotes_Stats.jsonc';
  import blizzardEmployeeStatsJSON from '$assets/BlizzardEmployees_Stats.jsonc';
	import TimelinePlotPointPopover from './lib/TimelinePlotPointPopover.svelte';
  import { min, range, sum } from './lib/util';
  import { PlotPointEvent, PlotPointType } from './lib/model';
	import type { PlotPoint } from './lib/model';
	import RotateScreenIndicator from './lib/RotateScreenIndicator.svelte';
	import ExternalAnchor from './lib/ExternalAnchor.svelte';
	import ComplexTranslation from 'lib/translations/ComplexTranslation.svelte';

  const patchNotePlotPoints: PlotPoint[] = patchNotesStatsJSON.data.map((statJSON) => {
    let event: PlotPointEvent;

    if (statJSON.workshopHighlights.length > 0) {
      event = PlotPointEvent.MAJOR_WORKSHOP_UPDATE;
    } else if (statJSON.bugFixes.workshop > 0) {
      event = PlotPointEvent.WORKSHOP_BUGFIX;
    } else {
      event = PlotPointEvent.NOTHING_RELATED_TO_WORKSHOP;
    }

    /*
      * Same as what Cactus did for his visualization
      * See: https://discord.com/channels/570672959799164958/1279059342691274805/1279103165597351966
      */
    const weight = Math.log(
      sum(Object.values(statJSON.updates)) +
      sum(Object.values(statJSON.bugFixes)) * 0.5 +
      1
    ) * 16;

    return {
      type: PlotPointType.OVERWATCH_PATCH_NOTE,
      date: parseISO(statJSON.date),
      event,
      weight,
      stat: statJSON
    } satisfies PlotPoint;
  });

  const maxPatchNotesPlotPointWeight = patchNotePlotPoints
    .reduce((max, { weight }) => Math.max(weight, max), 0);

  const blizzardEmployeesLeavingPlotPoints: PlotPoint[] = blizzardEmployeeStatsJSON.data
    .filter((statJSON) => statJSON.workedOnWorkshop && statJSON.action === "left")
    .map((statJSON) => {
      return {
        type: PlotPointType.EMPLOYEE_STATUS_CHANGE,
        date: parseISO(statJSON.date),
        event: PlotPointEvent.WORKSHOP_DEV_LEAVES,
        weight: maxPatchNotesPlotPointWeight * 1.05,
        stat: statJSON
      } satisfies PlotPoint;
    });

  const plotPoints: PlotPoint[] = [
    ... patchNotePlotPoints,
    ... blizzardEmployeesLeavingPlotPoints
  ];

  const dataLastUpdated = new Date(
    min([
      new Date(patchNotesStatsJSON.lastUpdatedDate).getTime(),
      new Date(blizzardEmployeeStatsJSON.lastUpdatedDate).getTime(),
    ])
  );

  const PATCH_NOTE_Z_ORDER_PRIORITY: { [K in PlotPointEvent]: number } = {
    [PlotPointEvent.WORKSHOP_DEV_LEAVES]: 1,
    [PlotPointEvent.MAJOR_WORKSHOP_UPDATE]: 2,
    [PlotPointEvent.WORKSHOP_BUGFIX]: 3,
    [PlotPointEvent.NOTHING_RELATED_TO_WORKSHOP]: 4,
  }

  const PATCH_NOTE_LEGEND_TEXT: { [K in PlotPointEvent]: string } = {
    [PlotPointEvent.WORKSHOP_DEV_LEAVES]: $t('TimelinePage.legend.workshop-dev-leaves'),
    [PlotPointEvent.MAJOR_WORKSHOP_UPDATE]: $t('TimelinePage.legend.major-workshop-update'),
    [PlotPointEvent.WORKSHOP_BUGFIX]: $t('TimelinePage.legend.workshop-bugfix'),
    [PlotPointEvent.NOTHING_RELATED_TO_WORKSHOP]: $t('TimelinePage.legend.nothing-related-to-workshop')
  }

  // We need to render the patch notes from highest to lowest priority,
  // so higher priority patch notes overlap lower priority ones.
  // See: https://stackoverflow.com/questions/17786618/how-to-use-z-index-in-svg-elements
  const prioritizedPlotPoint = plotPoints.sort(
    (a, b) => PATCH_NOTE_Z_ORDER_PRIORITY[b.event] - PATCH_NOTE_Z_ORDER_PRIORITY[a.event]
  );

  const plotPointEvents = Object.values(PlotPointEvent)
    .sort((plotPointEvent) => -PATCH_NOTE_Z_ORDER_PRIORITY[plotPointEvent]);

  let enabledPlotPointEvents = Object.fromEntries(
    Object.values(PlotPointEvent)
      .map((plotPointEvent) => [plotPointEvent, true])
  )

  let hoveredPlotPoint: {
    plotPoint: PlotPoint;
    element: SVGGeometryElement;
  } | null = null;

  const now = new Date();

  let dateRange: { min: Date; max: Date } | null = null;
  for (const stat of plotPoints) {
    if (dateRange) {
      if (stat.date.getTime() < dateRange.min.getTime()) {
        dateRange.min = stat.date;
      }
      if (stat.date.getTime() > dateRange.max.getTime()) {
        dateRange.max = stat.date;
      }
    } else {
      dateRange = { min: stat.date, max: stat.date };
    }
  }

  const graphHorizontalMargin = 20;

  const yearMarkerLineHeight = 2;
  const yearMarkerTextOffsetFromLine = 10;

  const yearMarkerDotSize = 2.5;
  const yearMarkerLength = 65 - yearMarkerDotSize + yearMarkerLineHeight;

  const floorStrokeWidth = 2.5;
  const floorHeight = floorStrokeWidth + yearMarkerLength + yearMarkerLineHeight;

  const plotPointWidth = 3;
  const plotPointMaxHeight = 60;

  const trackedTimeLineFloorWidth = dateRange
    ? (differenceInDays(dateRange.max, dateRange.min) + 1)
    : 100;
  const untrackedTimeLineFloorWidth = dateRange
    ? differenceInDays(now, dateRange.max)
    : 0;

  const untrackedFloorTextLineHeight = 1.5;

  const viewBoxWidth = trackedTimeLineFloorWidth + untrackedTimeLineFloorWidth + graphHorizontalMargin * 2;
  const viewBoxHeight = plotPointMaxHeight + floorHeight + (yearMarkerLength + yearMarkerLineHeight);
</script>

<style lang="scss">
  :root {
    --Timeline__axis-color: #c7cbcd;

    --Timeline__axis-untracked-text-color: #818181;
    --Timeline__axis-untracked-color: #8a0000;

    --Timeline__highlighted-plot-point-stroke-color: rgba(255, 255, 255, 0.9);

    --Timeline__event-workshop-dev-leaves-color: #D84244;
    --Timeline__event-major-workshop-update-color: #EBCF29;
    --Timeline__event-workshop-bugfix-color: #7FEDE6;
    --Timeline__event-nothing-related-to-workshop-color: #6E6F7C;

    @media (prefers-color-scheme: light) {
      --Timeline__axis-color: #707273;

      --Timeline__axis-untracked-text-color: #0d0d0d;
      --Timeline__axis-untracked-color: #d10101;

      --Timeline__highlighted-plot-point-stroke-color: #000000;

      --Timeline__event-workshop-dev-leaves-color: #B33B3C;
      --Timeline__event-major-workshop-update-color: #C5AF2B;
      --Timeline__event-workshop-bugfix-color: #69C1BC;
      --Timeline__event-nothing-related-to-workshop-color: #636363;
    }
  }

  .timeline {
    padding: 2rem;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: auto;
  }

  .heading {
    margin-bottom: 2rem;
    font-style: italic;

    &__title {
      font-weight: bold;
      font-size: 2rem;
    }
  }

  .graph-container {
    position: relative;
    width: 100%;
    place-self: end center;

    .graph {
      user-select: none;
      display: block;
    }
  }

  .legend {
    display: inline-block;

    &__item {
      cursor: pointer;
      user-select: none;
      margin-bottom: 0.5rem;
      display: block;

      &--disabled {
        opacity: 0.5;
      }

      &::before {
        content: "";
        margin-right: 0.5ch;
        height: 1.25rem;
        aspect-ratio: 1;
        border-radius: 20%;
        display: inline-block;
        vertical-align: bottom;
      }

      &--event-workshop-dev-leaves::before {
        background-color: var(--Timeline__event-workshop-dev-leaves-color);
      }
      &--event-major-workshop-update::before {
        background-color: var(--Timeline__event-major-workshop-update-color);
      }
      &--event-workshop-bugfix::before {
        background-color: var(--Timeline__event-workshop-bugfix-color);
      }
      &--event-nothing-related-to-workshop::before {
        background-color: var(--Timeline__event-nothing-related-to-workshop-color);
      }
    }
  }

  text {
    font-size: calc(var(--line-height) * 8px); // try to convert "SVG" pixels to CSS pixels
  }

  .year-marker {
    &__text {
      color: var(--Timeline__axis-color);
    }
  }

  .plot-point {
    cursor: pointer;

    &--selected {
      stroke: var(--Timeline__highlighted-plot-point-stroke-color);
      stroke-width: 0.25;
    }

    &--event-workshop-dev-leaves {
      color: var(--Timeline__event-workshop-dev-leaves-color);
    }
    &--event-major-workshop-update {
      color: var(--Timeline__event-major-workshop-update-color);
    }
    &--event-workshop-bugfix {
      color: var(--Timeline__event-workshop-bugfix-color);
    }
    &--event-nothing-related-to-workshop {
      color: var(--Timeline__event-nothing-related-to-workshop-color);
    }
  }

  .untracked-floor-text {
    color: var(--Timeline__axis-untracked-text-color);
    font-style: italic;
  }

  .rotate-screen-indicator {
    display: none;
    margin: auto;
  }

  @media (max-aspect-ratio: 1.2/1) {
    .timeline {
      display: none;
    }

    .rotate-screen-indicator {
      display: initial;
    }
  }
</style>

<svelte:head>
  <title>{$t('TimelinePage.tab-title')}</title>
</svelte:head>

<div class="timeline">
  <div>
    <header class="heading">
      <Link to="../" title={$t("TimelinePage.heading.back-link-tooltip")}>
        <ChevronBack size=32 />
      </Link>
      <span class="heading__title">{$t('TimelinePage.heading.title')}</span>
      <span class="heading__credits">
        <ComplexTranslation
          t={$t('TimelinePage.heading.credits')}
          markers={{
            link: (text) => ({
              component: ExternalAnchor,
              props: {
                href: 'https://youtube.com/@CactusPuppy'
              },
              slots: {
                default: text
              }
            })
          }}
        />
      </span>

      {#if dateRange}
        <div class="heading__range">{
          $t('TimelinePage.heading.range', {
            values: {
              min: formatDate(dateRange.min, 'yyyy-MM'),
              max: formatDate(dateRange.max, 'yyyy-MM'),
              lastUpdated: formatDate(dataLastUpdated, 'yyyy-MM-dd')
            }
          })
        }</div>
      {/if}
    </header>

    <div class="legend">
      {#each plotPointEvents as plotPointEvent}
        <!-- TODO(netux): a11y -->
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <span
          class="legend__item legend__item--event-{plotPointEvent}"
          class:legend__item--disabled={!enabledPlotPointEvents[plotPointEvent]}
          on:click={() => enabledPlotPointEvents[plotPointEvent] = !enabledPlotPointEvents[plotPointEvent]}
        >{PATCH_NOTE_LEGEND_TEXT[plotPointEvent]}</span>
      {/each}
    </div>
  </div>


  <!-- TODO(netux): a11y -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <!-- svelte-ignore a11y-mouse-events-have-key-events -->
  <div
    class="graph-container"
    on:mouseleave|self={() => {
      hoveredPlotPoint = null;
    }}
  >
    <svg
      class="graph"
      viewBox="0 0 {viewBoxWidth} {viewBoxHeight}"
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
    >
      <defs>
        <marker
          id="Timeline__year-marker__dot"
          refX={yearMarkerDotSize / 2}
          refY={yearMarkerDotSize / 2}
          orient="auto"
          markerWidth={yearMarkerDotSize}
          markerHeight={yearMarkerDotSize}
          viewBox="0 0 {yearMarkerDotSize} {yearMarkerDotSize}"
          preserveAspectRatio="xMidYMid"
        >
          <circle
            r={yearMarkerDotSize / 2}
            cx={yearMarkerDotSize / 2}
            cy={yearMarkerDotSize / 2}
            fill="context-stroke"
          />
        </marker>

        <linearGradient id="Timeline__untracked-floor-gradient">
          <stop offset="0%" stop-color="var(--Timeline__axis-color)" />
          <stop offset="20%" stop-color="var(--Timeline__axis-untracked-color)" />
        </linearGradient>
      </defs>

      {#if dateRange}
        <!-- Year Markers -->
        <g id="Timeline__year-markers">
          {#each range(dateRange.min.getFullYear() + 1, now.getFullYear() + 1) as year}
            {@const x = graphHorizontalMargin * 2 + differenceInDays(new Date(year, 0, 0), dateRange.min)}
            <g>
              <!-- Line -->
              <path
                id="Timeline__year-marker__{year}"
                d="
                  M {x} {viewBoxHeight - floorHeight + floorStrokeWidth / 2}
                  L {x} {viewBoxHeight - (yearMarkerDotSize * 3 + yearMarkerLineHeight / 2)}
                "
                stroke="var(--Timeline__axis-color)"
                stroke-width="{floorStrokeWidth}"
                stroke-dasharray="13"
                stroke-dashoffset="5"
                stroke-linecap="round"
                marker-end="url(#Timeline__year-marker__dot)"
              />
              <!-- Text -->
              <text
                class="year-marker__text"
                style:--line-height={yearMarkerLineHeight}
                x={x + yearMarkerTextOffsetFromLine}
                y={viewBoxHeight - (yearMarkerLineHeight / 2)}
                fill="currentcolor"
              >{year}</text>
            </g>
          {/each}
        </g>
        <!-- Plot Points -->
        <g id="Timeline__plot-points">
          {#each prioritizedPlotPoint as plotPoint}
            {#if enabledPlotPointEvents[plotPoint.event]}
              <!-- TODO(netux): a11y -->
              {@const x = graphHorizontalMargin + differenceInDays(plotPoint.date, dateRange.min)}
              {@const height = plotPointMaxHeight * (plotPoint.weight / maxPatchNotesPlotPointWeight)}
              <!-- svelte-ignore a11y-mouse-events-have-key-events -->
              <!-- svelte-ignore a11y-no-static-element-interactions -->
              <rect
                id="Timeline__plot-point__{formatDate(plotPoint.date, 'yyyy-MM-dd')}"
                class="plot-point plot-point--event-{plotPoint.event}"
                class:plot-point--selected={hoveredPlotPoint?.plotPoint === plotPoint}
                x={x}
                y={viewBoxHeight - (floorHeight + height)}
                width={plotPointWidth}
                height={height}
                fill="currentcolor"
                on:mouseover|self={(event) => {
                  hoveredPlotPoint = {
                    plotPoint: plotPoint,
                    element: event.currentTarget
                  };
                }}
              />
            {/if}
          {/each}
        </g>
      {/if}

      <!-- Floors -->
      <rect
        id="Timeline__tracked-floor"
        x={0}
        y={viewBoxHeight - floorHeight}
        width={graphHorizontalMargin + trackedTimeLineFloorWidth}
        height={floorStrokeWidth}
        fill="var(--Timeline__axis-color)"
      />

      {#if trackedTimeLineFloorWidth > 50}
        <rect
          id="Timeline__untracked-floor"
          x={graphHorizontalMargin + trackedTimeLineFloorWidth}
          y={viewBoxHeight - floorHeight}
          width={untrackedTimeLineFloorWidth + graphHorizontalMargin}
          height={floorStrokeWidth}
          fill="url(#Timeline__untracked-floor-gradient)"
        />

        <text
          id="Timeline__untracked-floor-text"
          class="untracked-floor-text"
          style:--line-height={untrackedFloorTextLineHeight}
          x={graphHorizontalMargin + trackedTimeLineFloorWidth + untrackedTimeLineFloorWidth}
          y={viewBoxHeight - floorHeight - untrackedFloorTextLineHeight * 4}
          text-anchor="end"
          fill="currentcolor"
        >{$t("TimelinePage.timeline.untracked-text")}</text>
      {/if}
    </svg>

    {#if hoveredPlotPoint}
      <TimelinePlotPointPopover
        plotPoint={hoveredPlotPoint.plotPoint}
        plotPointElement={hoveredPlotPoint.element}
      />
    {/if}
  </div>
</div>

<div class="rotate-screen-indicator">
  <RotateScreenIndicator
    width="15rem"
    height="15rem"
  />
</div>
