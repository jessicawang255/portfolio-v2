export function Flower09() {
  return (
    <svg width={100} height={100} viewBox="0 0 100 102" fill="none">
      <g filter="url(#filter0_ng_467_1817)">
        <path d="M63.2391 12.8182C65.5056 10.5517 68.752 9.56291 71.8973 10.1805L84.7137 12.6971C88.5495 13.4503 91.5482 16.4492 92.3016 20.285L94.8191 33.1023C95.4365 36.2475 94.4478 39.4941 92.1814 41.7605L78.9422 54.9988L92.1814 68.2381C94.4478 70.5046 95.4375 73.7511 94.8201 76.8963L92.3025 89.7137C91.5491 93.5494 88.5504 96.5482 84.7146 97.3016L71.8982 99.8182C68.7528 100.436 65.5057 99.4461 63.2391 97.1795L49.9998 83.9402L36.7605 97.1785C34.4939 99.4452 31.2468 100.435 28.1014 99.8172L15.285 97.3006C11.4495 96.5472 8.45053 93.5482 7.69707 89.7127L5.18047 76.8953C4.56294 73.75 5.5516 70.5027 7.81816 68.2361L21.0574 54.9979L7.82011 41.7605C5.55367 39.4939 4.56481 36.2476 5.18242 33.1023L7.69804 20.2859C8.4513 16.45 11.451 13.4514 15.2869 12.698L28.1033 10.1805C31.2484 9.56304 34.495 10.552 36.7615 12.8182L49.9998 26.0564L63.2391 12.8182ZM49.9978 41.2283C42.393 41.2285 36.2283 47.394 36.2283 54.9988C36.2285 62.6035 42.3931 68.7682 49.9978 68.7684C57.6027 68.7684 63.7682 62.6036 63.7684 54.9988C63.7684 47.3939 57.6028 41.2283 49.9978 41.2283ZM49.9998 45.7195C55.1248 45.7195 59.28 49.8738 59.2801 54.9988C59.2801 60.1239 55.1249 64.2791 49.9998 64.2791C44.8748 64.279 40.7205 60.1238 40.7205 54.9988C40.7206 49.8739 44.8749 45.7196 49.9998 45.7195Z" fill="#F97516"/>
      </g>
      <defs>
        <filter id="filter0_ng_467_1817" x="3.0808" y="8.0808" width="93.8384" height="93.8365" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
          <feTurbulence type="fractalNoise" baseFrequency="1.4473605155944824 1.4473605155944824" stitchTiles="stitch" numOctaves="3" result="noise" seed="6296"/>
          <feColorMatrix in="noise" type="luminanceToAlpha" result="alphaNoise"/>
          <feComponentTransfer in="alphaNoise" result="coloredNoise1">
            <feFuncA type="discrete" tableValues="0 0 0 0 0 0 0 0 0 0 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0"/>
          </feComponentTransfer>
          <feComposite operator="in" in2="shape" in="coloredNoise1" result="noise1Clipped"/>
          <feFlood floodColor="#B9BFFE" result="color1Flood"/>
          <feComposite operator="in" in2="noise1Clipped" in="color1Flood" result="color1"/>
          <feMerge result="effect1_noise_467_1817">
            <feMergeNode in="shape"/>
            <feMergeNode in="color1"/>
          </feMerge>
          <feTurbulence type="fractalNoise" baseFrequency="0.065131224691867828 0.065131224691867828" numOctaves="3" seed="5997"/>
          <feDisplacementMap in="effect1_noise_467_1817" scale="3.838404655456543" xChannelSelector="R" yChannelSelector="G" result="displacedImage" width="100%" height="100%"/>
          <feMerge result="effect2_texture_467_1817">
            <feMergeNode in="displacedImage"/>
          </feMerge>
        </filter>
      </defs>
    </svg>
  )
}
