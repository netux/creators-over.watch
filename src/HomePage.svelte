<script lang="ts">
  import {
    LAST_BIG_UPDATE_DATE,
    LAST_OKAY_UPDATE_DATE
  } from './lib/env';
  import { Link } from 'svelte-routing';
  import youtubeVideos from '$assets/YouTubeVideos.jsonc';
  import WorkshopUpdateTimeCounters from './lib/WorkshopUpdateTimeCounters.svelte';
  import YouTubeVideoCard from './lib/YouTubeVideoCard.svelte';
	import ExternalAnchor from 'lib/ExternalAnchor.svelte';
</script>

<style lang="scss">
  .container {
    height: 100%;
    scrollbar-width: thin;
    overflow: auto;
  }

  .section {
    margin: 0 auto;
    min-height: max-content;
    // TODO(netux): sections may overflow
    height: inherit;

    &--counters {
      min-height: 500px; /* ugly */
      display: flex;
    }

    &--text {
      min-height: 700px; /* ugly */
      padding: 2rem;
      margin-inline: 2rem;

      @media (max-width: 1280px) {
        margin-inline: 0;
      }

      & h1 {
        text-transform: uppercase;
      }

      & h1, & p {
        margin-inline: auto;
        text-align: justify;
      }
    }
  }

  .counters {
    max-width: 1280px;
    padding: 2rem;
    margin: auto;
    text-align: center;
    place-self: center;
  }

  .cards {
    --columns: 3;

    margin-top: 3rem;
    display: grid;
    grid-template-columns: repeat(var(--columns), 1fr);
    gap: 2rem;

    @media (min-width: 1440px) {
      --columns: 4;
    }

    @media (max-width: 900px) {
      --columns: 2;
    }

    @media (max-width: 650px) {
      --columns: 1;
    }
  }

  .footer {
    font-size: 80%;
    padding-block: 5rem 2rem;
    height: auto;

    &__hashtag {
      font-size: 75%;
      font-weight: bold;
      opacity: 0.5;
    }
  }
</style>

<svelte:head>
  <title>Creators of Overwatch</title>
</svelte:head>

<div class="container">
  <section class="section section--counters">
    <div class="counters">
      <WorkshopUpdateTimeCounters
        lastBigUpdate={LAST_BIG_UPDATE_DATE}
        lastOkayUpdate={LAST_OKAY_UPDATE_DATE}
      />
    </div>
  </section>

  <section class="section section--text">
    <h1>The Workshop is dead</h1>
    <p>
      Following the departure of the main people working in Workshop, the Overwatch Workshop has been left to rot.
    </p>
    <p>
      Since Overwatch 2 became publicly available, the Workshop has gotten more and more broken every patch.
      Things that used to work no longer do (or were removed entirely without warning), and new things (like new heroes) lack proper support.
    </p>
    <p>
      Workshop could be so much more. But in its current state, it is practically impossible to get anything done in it.
    </p>

    <div class="cards">
      {#each youtubeVideos as video}
        <YouTubeVideoCard video={video} />
      {/each}
    </div>

    <div class="footer">
      See also:
      <ul class="footer__links">
        <li><Link to="/timeline">Timeline of Patch Notes since the Workshop was released</Link></li>
        <li><ExternalAnchor href="https://workshop.codes/wiki/articles/ow2-workshop-changesbugs">A non-exhaustive list of issues with the Workshop, by the workshop.codes community</ExternalAnchor></li>
      </ul>
      <div class="footer__hashtag">#FixOverwatchWorkshop</div>
    </div>
  </section>
</div>
