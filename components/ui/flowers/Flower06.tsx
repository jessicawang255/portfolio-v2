export function Flower06() {
  return (
    <svg width={100} height={100} viewBox="0 0 104 104" fill="none">
      <g filter="url(#filter0_gn_467_1855)">
        <path d="M51.918 1.91992C57.6439 1.91992 62.2861 6.56213 62.2861 12.2881C62.2861 16.7763 59.4328 27.7209 55.4424 43.4092C63.7145 29.4934 69.4386 19.7372 72.6123 16.5635C76.6612 12.515 83.2257 12.5148 87.2744 16.5635C91.3233 20.6123 91.3233 27.1777 87.2744 31.2266C84.1003 34.4006 74.3422 40.1234 60.4248 48.3965C76.1161 44.4053 87.0631 41.5527 91.5518 41.5527C97.2777 41.5528 101.919 46.195 101.919 51.9209C101.919 57.6467 97.2775 62.288 91.5518 62.2881C87.0639 62.2881 76.1202 59.4363 60.4336 55.4463C74.3468 63.7168 84.1011 69.4399 87.2744 72.6133C91.323 76.6622 91.3232 83.2266 87.2744 87.2754C83.2256 91.3241 76.6612 91.3239 72.6123 87.2754C69.4385 84.1016 63.715 74.3443 55.4424 60.4277C59.4332 76.1176 62.2861 87.0633 62.2861 91.5518C62.2861 97.2777 57.6439 101.92 51.918 101.92C46.1922 101.92 41.5508 97.2776 41.5508 91.5518C41.5508 87.0645 44.4004 76.1228 48.3896 60.4395C40.1211 74.3493 34.4004 84.1015 31.2275 87.2744C27.1787 91.3231 20.6142 91.3232 16.5654 87.2744C12.5166 83.2256 12.5167 76.6612 16.5654 72.6123C19.7386 69.4392 29.4916 63.7169 43.4033 55.4473C27.7178 59.437 16.7748 62.2891 12.2871 62.2891C6.56119 62.289 1.91992 57.6468 1.91992 51.9209C1.91995 46.195 6.56121 41.5528 12.2871 41.5527C16.7751 41.5527 27.7197 44.4043 43.4072 48.3945C29.4929 40.1233 19.737 34.4011 16.5635 31.2275C12.515 27.1787 12.5148 20.6142 16.5635 16.5654C20.6122 12.5167 27.1767 12.5169 31.2256 16.5654C34.3989 19.7387 40.1214 29.4927 48.3916 43.4053C44.4017 27.7192 41.5498 16.7759 41.5498 12.2881C41.5498 6.56214 46.192 1.91994 51.918 1.91992Z" fill="#962775"/>
      </g>
      <defs>
        <filter id="filter0_gn_467_1855" x="0.000719547" y="0.000719547" width="103.838" height="103.838" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
          <feTurbulence type="fractalNoise" baseFrequency="0.065131224691867828 0.065131224691867828" numOctaves="3" seed="5997"/>
          <feDisplacementMap in="shape" scale="3.838404655456543" xChannelSelector="R" yChannelSelector="G" result="displacedImage" width="100%" height="100%"/>
          <feMerge result="effect1_texture_467_1855">
            <feMergeNode in="displacedImage"/>
          </feMerge>
          <feTurbulence type="fractalNoise" baseFrequency="1.4473605155944824 1.4473605155944824" stitchTiles="stitch" numOctaves="3" result="noise" seed="6296"/>
          <feColorMatrix in="noise" type="luminanceToAlpha" result="alphaNoise"/>
          <feComponentTransfer in="alphaNoise" result="coloredNoise1">
            <feFuncA type="discrete" tableValues="0 0 0 0 0 0 0 0 0 0 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0"/>
          </feComponentTransfer>
          <feComposite operator="in" in2="effect1_texture_467_1855" in="coloredNoise1" result="noise1Clipped"/>
          <feFlood floodColor="#B9BFFE" result="color1Flood"/>
          <feComposite operator="in" in2="noise1Clipped" in="color1Flood" result="color1"/>
          <feMerge result="effect2_noise_467_1855">
            <feMergeNode in="effect1_texture_467_1855"/>
            <feMergeNode in="color1"/>
          </feMerge>
        </filter>
      </defs>
    </svg>
  )
}
