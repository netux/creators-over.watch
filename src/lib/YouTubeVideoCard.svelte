<script lang="ts">
  import type { YouTubeVideo, YouTubeVideoVersion } from '$assets/YouTubeVideos.jsonc';

  const languageCodeToNameMap: Record<string, string> = {
    'en': 'English',
    'es': 'Español'
  };

  export let video: YouTubeVideo;

  function youtubeVideoDurationToSeconds(durationStr: string): number {
    const split = durationStr.split(':').map((value) => parseInt(value, 10));
    let hh = 0, mm = 0, ss = 0;
    if (split.length === 2) {
      [mm, ss] = split;
    } else if (split.length === 3) {
      [hh, mm, ss] = split;
    } else {
      throw new Error(`Invalid YouTube video duration '${durationStr}'`);
    }

    return hh * 60 * 60 + mm * 60 + ss;
  }

  const getVideoLink = (videoVersion: YouTubeVideoVersion) => {
    const searchParams = new URLSearchParams();

    if (videoVersion.timestamp) {
      searchParams.set('t', youtubeVideoDurationToSeconds(videoVersion.timestamp).toString(10));
    }

    return `https://youtu.be/${videoVersion.id}${searchParams.size > 0 ? `?${searchParams.toString()}` : ''}`;
  };

  let defaultVersion: YouTubeVideoVersion | null = null;
  $: defaultVersion = video.versions.find((version) => version.language === "en") || video.versions[0];
</script>

<style lang="scss">
  :root {
    --YouTubeVideoCard__background-color: #393939;
    --YouTubeVideoCard__box-shadow-color: rgba(0, 0, 0, .1);
    --YouTubeVideoCard__video-creator-color: #C5C5C5;
    --YouTubeVideoCard__video-note-color: #A9A9A9;

    @media (prefers-color-scheme: light) {
      --YouTubeVideoCard__background-color: #CDCDCD;
      // --YouTubeVideoCard__box-shadow-color: /* same */;
      --YouTubeVideoCard__video-creator-color: #575757;
      --YouTubeVideoCard__video-note-color: #000000;
    }
  }

  .card {
    display: inline-block;
    background-color: var(--YouTubeVideoCard__background-color);
    box-shadow: 0 0 1rem var(--YouTubeVideoCard__box-shadow-color);
    border-radius: 1rem;
    text-decoration: none;
    color: var(--primary-text-color);
    overflow: hidden; // cut off thumbnail
  }

  .thumbnail {
    width: 100%;
  }

  .info {
    margin: 1rem;

    &__title {
      margin-bottom: 0.3rem;
    }

    &__creator {
      margin-bottom: 0.25rem;
      font-size: 80%;
      color: var(--YouTubeVideoCard__video-creator-color);
    }

    &__note {
      margin-top: 0.5rem;
      font-size: 60%;
      font-style: italic;
      color: var(--YouTubeVideoCard__video-note-color);
    }
  }
</style>

{#if defaultVersion != null}
  <a
    class="card"
    href={getVideoLink(defaultVersion)}
    target="_blank"
  >
    <img
      class="thumbnail"
      src="https://i3.ytimg.com/vi/{defaultVersion.id}/maxresdefault.jpg"
      alt="Thumbnail for {video.creator}'s video {`"${defaultVersion.title}"`}"
    />
    <div class="info">
      <div class="info__title">{defaultVersion.title}</div>
      <div class="info__creator">by <b>{video.creator}</b></div>

      {#if video.note}
        <div class="info__note">{video.note}</div>
      {/if}

      {#if video.versions.length > 1}
        {@const otherVersions = video.versions.filter((version) => version !== defaultVersion)}
        <div class="info__note">
          Also in
          {#each otherVersions as otherVersion, otherVersionIndex}
            <a
              href={getVideoLink(otherVersion)}
              target="_blank"
            >{languageCodeToNameMap[otherVersion.language.toLowerCase()] || otherVersion.language}</a>
            {#if otherVersionIndex < otherVersions.length - 1}, {/if}
          {/each}
        </div>
      {/if}
    </div>
  </a>
{/if}
