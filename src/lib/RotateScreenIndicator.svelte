<script lang="ts">
  const viewBoxWidth = 100;
  const viewBoxHeight = 100;

  const phoneHeight = 75;
  const phoneWidth = phoneHeight * (1 / 1.75);

  const phoneCameraHoleRadius = 1.25;

  const phoneScreenWidth = phoneWidth * 0.9;
  const phoneScreenHeight = phoneHeight * 0.7;

  const phoneButtonWidth = phoneWidth * 0.14;
  const phoneButtonHeight = phoneButtonWidth;
</script>

<style lang="scss">
  :root {
    --RotateScreenIndicator__phone-color: #D3D3D3;

    @media (prefers-color-scheme: light) {
      --RotateScreenIndicator__phone-color: #000000;
    }
  }

  @keyframes rotate-90 {
    0%, 20% { transform: rotate(0deg); }
    40%, 100% { transform: rotate(90deg); }
  }

  .indicator {
    animation: 6s rotate-90 linear infinite
  }
</style>

<svg
  class="indicator"
  viewBox="0 0 {viewBoxWidth} {viewBoxHeight}"
  style:color="var(--RotateScreenIndicator__phone-color)"
  {... $$restProps}
>
  <defs>
    <marker
      id="RotateScreenIndicator__arrow-end"
      refX={0}
      refY={1.5}
      orient="auto"
      markerWidth={3}
      markerHeight={3}
      viewBox="0 0 3 3"
      preserveAspectRatio="xMidYMid"
    >
      <polygon
        points="0,0 2,1.5 0,3"
        fill="context-stroke"
      />
    </marker>
  </defs>
  <mask id="RotateScreenIndicator__phone-mask">
    <rect
      x={0} y={0}
      width={100} height={100}
      fill="white"
    />

    <circle
      id="RotateScreenIndicator__phone-camera-hole"
      cx={(viewBoxWidth - phoneCameraHoleRadius) / 2}
      cy={(
        // between phone top and phone screen top
        (viewBoxHeight - phoneHeight) / 2 +
        (viewBoxHeight - phoneScreenHeight) / 2 +
        phoneCameraHoleRadius
      ) / 2}
      r={phoneCameraHoleRadius}
      fill="black"
    />

    <rect
      id="RotateScreenIndicator__phone-screen"
      x={(viewBoxWidth - phoneScreenWidth) / 2}
      y={(viewBoxHeight - phoneScreenHeight) / 2}
      width={phoneScreenWidth}
      height={phoneScreenHeight}
      fill="black"
    />

    <rect
      id="RotateScreenIndicator__phone-button"
      x={(viewBoxWidth - phoneButtonWidth) / 2}
      y={(
        // between phone top and phone screen top
        (
          (viewBoxHeight / 2 + phoneHeight / 2) +
          (viewBoxHeight / 2 + phoneScreenHeight / 2)
        ) -
        phoneButtonHeight
      ) / 2}
      rx={1}
      ry={1}
      width={phoneButtonWidth}
      height={phoneButtonHeight}
      fill="black"
    />
  </mask>

  <rect
    id="RotateScreenIndicator__phone"
    x={(viewBoxWidth - phoneWidth) / 2}
    y={(viewBoxHeight - phoneHeight) / 2}
    rx={3.5}
    ry={3.5}
    width={phoneWidth}
    height={phoneHeight}
    fill="currentcolor"
    mask="url(#RotateScreenIndicator__phone-mask)"
  />

  <path
    d="
      M 0,10
      C 0,10 0,5
        2.5,2.5 5,0
        10,0 10,0
    "
    transform="
      translate(20, 5)
    "
    stroke="currentcolor"
    stroke-width="2"
    fill="none"
    marker-end="url(#RotateScreenIndicator__arrow-end)"
  />
  <path
  d="
    M 0,10
    C 0,10 0,5
      2.5,2.5 5,0
      10,0 10,0
  "
  transform="
    translate(80, 95)
    rotate(180)
  "
  stroke="currentcolor"
  stroke-width="2"
  fill="none"
  marker-end="url(#RotateScreenIndicator__arrow-end)"
/>
</svg>
