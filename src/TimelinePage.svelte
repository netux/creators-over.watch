<script lang="ts">
  import { getDaysInYear, getDayOfYear, format as formatDate } from 'date-fns';
  import patchNotesStatsJSON from './assets/PatchNotes_Stats.json';
  import blizzardEmployeeStatsJSON from './assets/BlizzardEmployees_Stats.json';
	import TimelinePlotPointPopover from './lib/TimelinePlotPointPopover.svelte';
  import { min, range, sum } from './lib/util';
  import { PlotPointEvent, PlotPointType } from './lib/model';
	import type { PlotPoint } from './lib/model';
	import RotateScreenIndicator from './lib/RotateScreenIndicator.svelte';
	import ExternalAnchor from './lib/ExternalAnchor.svelte';

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
      date: new Date(statJSON.date),
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
        date: new Date(statJSON.date),
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
    [PlotPointEvent.WORKSHOP_DEV_LEAVES]: "Workshop dev leaves",
    [PlotPointEvent.MAJOR_WORKSHOP_UPDATE]: "Major Workshop update",
    [PlotPointEvent.WORKSHOP_BUGFIX]: "Workshop bugfix",
    [PlotPointEvent.NOTHING_RELATED_TO_WORKSHOP]: "Nothing related to Workshop"
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

  const yearWidth = 12 /* months in a year */ * 20 /* width per month */;

  const yearMarkerLineHeight = 2;
  const yearMarkerTextOffsetFromLine = 10;

  const yearMarkerDotSize = 2.5;
  const yearMarkerLength = 65 - yearMarkerDotSize + yearMarkerLineHeight;

  const floorStrokeWidth = 2.5;
  const floorHeight = floorStrokeWidth + yearMarkerLength + yearMarkerLineHeight;

  const plotPointWidth = 3;
  const plotPointMaxHeight = 60;

  const viewBoxWidth = dateRange
    ? (dateRange.max.getFullYear() - dateRange.min.getFullYear() + 1) /* years */ * yearWidth
    : 100;
  const viewBoxHeight = plotPointMaxHeight + floorHeight + (yearMarkerLength + yearMarkerLineHeight);

  function calculatePlotPointPosition(plotPoint: PlotPoint) {
    const yearIdx = plotPoint.date.getFullYear() - dateRange!.min.getFullYear();
    const dayOfYearPercentage = getDayOfYear(plotPoint.date) / getDaysInYear(plotPoint.date);

    return {
      x: yearIdx * yearWidth + yearWidth * dayOfYearPercentage,
      height: plotPointMaxHeight * (plotPoint.weight / maxPatchNotesPlotPointWeight)
    };
  }
</script>

<style lang="scss">
  :root {
    --Timeline__axis-color: #c7cbcd;

    --Timeline__highlighted-plot-point-stroke-color: rgba(255, 255, 255, 0.9);

    --Timeline__event-workshop-dev-leaves-color: #D84244;
    --Timeline__event-major-workshop-update-color: #EBCF29;
    --Timeline__event-workshop-bugfix-color: #7FEDE6;
    --Timeline__event-nothing-related-to-workshop-color: #6E6F7C;

    @media (prefers-color-scheme: light) {
      --Timeline__axis-color: #707273;

      --Timeline__highlighted-plot-point-stroke-color: #00000;

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

  .year-marker {
    &__text {
      color: var(--Timeline__axis-color);
      font-size: calc(var(--line-height) * 8px); // try to convert "SVG" pixels to CSS pixels
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
</style>

<div class="timeline">
  <div>
    <header class="heading">
      <span class="heading__title">Overwatch Update Timeline</span>
      <span class="heading__credits">by <ExternalAnchor href="https://youtube.com/@CactusPuppy">CactusPuppy</ExternalAnchor></span>

      {#if dateRange}
        <div class="heading__range">
          {formatDate(dateRange.min, 'yyyy-MM')} - {formatDate(dateRange.max, 'yyyy-MM')}
          (last updated {formatDate(dataLastUpdated, 'yyyy-MM-dd')})
        </div>
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
      </defs>

      {#if dateRange}
        <!-- Year Markers -->
        <g id="Timeline__year-markers">
          {#each range(dateRange.min.getFullYear() + 1, dateRange.max.getFullYear() + 1) as year}
            {@const x = (year - dateRange.min.getFullYear()) * yearWidth}
            <g>
              <!-- Line -->
              <path
                id="Timeline__year-marker__{year}"
                d="
                  M {x} {viewBoxHeight - floorHeight}
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
              {@const { x, height } = calculatePlotPointPosition(plotPoint)}
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

      <!-- Floor -->
      <path
        id="Timeline__floor"
        d="
          M 0 {viewBoxHeight - floorHeight}
          L {viewBoxWidth} {viewBoxHeight - floorHeight}
        "
        stroke="var(--Timeline__axis-color)"
        stroke-width="{floorStrokeWidth}"
      />
      </svg>

    {#if hoveredPlotPoint}
      <TimelinePlotPointPopover
        plotPoint={hoveredPlotPoint.plotPoint}
        plotPointElement={hoveredPlotPoint.element}
      />
    {/if}
  </div>
</div>

