import React from "react";

interface RankMedalProps extends React.SVGProps<SVGSVGElement> {
  rank: 1 | 2 | 3;
}

export default function RankMedal({ rank, ...props }: RankMedalProps) {
  // Use unique IDs for gradients so they don't clash if multiple are on screen
  const idSuffix = `rank-${rank}-${Math.random().toString(36).substring(2, 7)}`;
  const p0 = `p0_${idSuffix}`;
  const p1 = `p1_${idSuffix}`;
  const p2 = `p2_${idSuffix}`;
  const p3 = `p3_${idSuffix}`;
  const p4 = `p4_${idSuffix}`;

  return (
    <svg width="60" height="84" viewBox="0 0 60 84" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M35.2059 82.6326L43.1837 70.4111C43.4086 70.0667 43.8349 69.8983 44.2447 69.9923L58.785 73.3277C59.5649 73.5065 60.228 72.7579 59.9252 72.0399L47.5826 42.7803L21.1172 53.2237L33.4598 82.4833C33.7626 83.202 34.7779 83.2886 35.2059 82.6326Z" fill={`url(#${p0})`}/>
      <path d="M38.8823 53.2244L37.4449 56.632L32.1304 69.2305L31.9107 69.7497L29.9997 74.2822L26.5393 82.484C26.2366 83.2017 25.2219 83.2882 24.7929 82.6333L16.8151 70.4121C16.5916 70.068 16.1646 69.899 15.7538 69.9934L1.21348 73.3284C0.434966 73.5072 -0.228123 72.7583 0.0750044 72.0402L12.4176 42.7803L38.8823 53.2244Z" fill={`url(#${p1})`}/>
      <path d="M29.9995 56.6312C46.168 56.6312 59.2752 43.9539 59.2752 28.3156C59.2752 12.6773 46.168 0 29.9995 0C13.831 0 0.723877 12.6773 0.723877 28.3156C0.723877 43.9539 13.831 56.6312 29.9995 56.6312Z" fill={`url(#${p2})`}/>
      <path d="M29.9995 54.113C44.7303 54.113 56.6719 42.563 56.6719 28.3153C56.6719 14.0676 44.7303 2.51758 29.9995 2.51758C15.2688 2.51758 3.32715 14.0676 3.32715 28.3153C3.32715 42.563 15.2688 54.113 29.9995 54.113Z" fill={`url(#${p3})`}/>
      <path d="M29.9996 52.5342C43.8288 52.5342 55.0396 41.6911 55.0396 28.3155C55.0396 14.9398 43.8288 4.09668 29.9996 4.09668C16.1705 4.09668 4.95972 14.9398 4.95972 28.3155C4.95972 41.6911 16.1705 52.5342 29.9996 52.5342Z" fill={`url(#${p4})`}/>
      <defs>
        <linearGradient id={p0} x1="22.6308" y1="70.2634" x2="58.1823" y2="55.147" gradientUnits="userSpaceOnUse">
          {rank === 1 ? (
            <>
              <stop offset="0.0012" stopColor="#FF0000"/>
              <stop offset="0.0444" stopColor="#E10000"/>
              <stop offset="0.0825" stopColor="#960000"/>
              <stop offset="0.2948" stopColor="#F80003"/>
              <stop offset="0.4449" stopColor="#DC0004"/>
              <stop offset="0.5583" stopColor="#F80003"/>
              <stop offset="0.6944" stopColor="#CD0001"/>
              <stop offset="0.8484" stopColor="#980001"/>
              <stop offset="0.9621" stopColor="#E30002"/>
              <stop offset="1" stopColor="#FF0002"/>
            </>
          ) : rank === 2 ? (
            <>
              <stop offset="0" stopColor="#0B5299"/>
              <stop offset="0.3" stopColor="#1E65AE"/>
              <stop offset="0.6" stopColor="#2572C4"/>
              <stop offset="1" stopColor="#084787"/>
            </>
          ) : (
            <>
              <stop offset="0" stopColor="#30925B"/>
              <stop offset="0.3" stopColor="#37A868"/>
              <stop offset="0.6" stopColor="#3EBA75"/>
              <stop offset="1" stopColor="#2A7D4E"/>
            </>
          )}
        </linearGradient>
        <linearGradient id={p1} x1="0.619195" y1="56.1039" x2="40.0595" y2="71.8202" gradientUnits="userSpaceOnUse">
          {rank === 1 ? (
            <>
              <stop offset="0.0012" stopColor="#FF0000"/>
              <stop offset="0.0444" stopColor="#E10000"/>
              <stop offset="0.0825" stopColor="#960000"/>
              <stop offset="0.2948" stopColor="#F80003"/>
              <stop offset="0.4449" stopColor="#DC0004"/>
              <stop offset="0.5583" stopColor="#F80003"/>
              <stop offset="0.6944" stopColor="#CD0001"/>
              <stop offset="0.8484" stopColor="#980001"/>
              <stop offset="0.9621" stopColor="#E30002"/>
              <stop offset="1" stopColor="#FF0002"/>
            </>
          ) : rank === 2 ? (
            <>
              <stop offset="0" stopColor="#0B5299"/>
              <stop offset="0.3" stopColor="#1E65AE"/>
              <stop offset="0.6" stopColor="#2572C4"/>
              <stop offset="1" stopColor="#084787"/>
            </>
          ) : (
            <>
              <stop offset="0" stopColor="#30925B"/>
              <stop offset="0.3" stopColor="#37A868"/>
              <stop offset="0.6" stopColor="#3EBA75"/>
              <stop offset="1" stopColor="#2A7D4E"/>
            </>
          )}
        </linearGradient>
        <linearGradient id={p2} x1="7.49211" y1="9.49039" x2="56.6119" y2="53.4071" gradientUnits="userSpaceOnUse">
          {rank === 1 ? (
            <>
              <stop offset="0.0012" stopColor="#EFA22B"/>
              <stop offset="0.134" stopColor="#F7DB51"/>
              <stop offset="0.2948" stopColor="#FFC739"/>
              <stop offset="0.446" stopColor="#FFF87B"/>
              <stop offset="0.5583" stopColor="#FFC839"/>
              <stop offset="0.6944" stopColor="#FFCE39"/>
              <stop offset="0.8472" stopColor="#FFEF7B"/>
              <stop offset="1" stopColor="#E09F26"/>
            </>
          ) : rank === 2 ? (
            <>
              <stop offset="0" stopColor="#9DA1A5"/>
              <stop offset="0.3" stopColor="#D5D9DC"/>
              <stop offset="0.6" stopColor="#A8ACB1"/>
              <stop offset="1" stopColor="#818588"/>
            </>
          ) : (
            <>
              <stop offset="0" stopColor="#B56F3F"/>
              <stop offset="0.3" stopColor="#D69263"/>
              <stop offset="0.6" stopColor="#B36E3E"/>
              <stop offset="1" stopColor="#915228"/>
            </>
          )}
        </linearGradient>
        <linearGradient id={p3} x1="3.32729" y1="28.3153" x2="56.672" y2="28.3153" gradientUnits="userSpaceOnUse">
          {rank === 1 ? (
            <>
              <stop offset="0.0012" stopColor="#C98214"/>
              <stop offset="0.1351" stopColor="#DE9709"/>
              <stop offset="0.2948" stopColor="#C2881B"/>
              <stop offset="0.446" stopColor="#DB9E2E"/>
              <stop offset="0.5583" stopColor="#E0A119"/>
              <stop offset="0.6944" stopColor="#D48805"/>
              <stop offset="0.8472" stopColor="#E0C041"/>
              <stop offset="1" stopColor="#BF8720"/>
            </>
          ) : rank === 2 ? (
            <>
              <stop offset="0" stopColor="#828588"/>
              <stop offset="0.3" stopColor="#B3B7BA"/>
              <stop offset="0.6" stopColor="#7E8184"/>
              <stop offset="1" stopColor="#6C6F72"/>
            </>
          ) : (
            <>
              <stop offset="0" stopColor="#8C491B"/>
              <stop offset="0.3" stopColor="#BD7443"/>
              <stop offset="0.6" stopColor="#884417"/>
              <stop offset="1" stopColor="#743911"/>
            </>
          )}
        </linearGradient>
        <linearGradient id={p4} x1="11.3096" y1="12.7221" x2="64.0573" y2="59.7648" gradientUnits="userSpaceOnUse">
          {rank === 1 ? (
            <>
              <stop offset="0.0012" stopColor="#EFA22B"/>
              <stop offset="0.134" stopColor="#F7DB51"/>
              <stop offset="0.2948" stopColor="#FFC739"/>
              <stop offset="0.446" stopColor="#FFF87B"/>
              <stop offset="0.5583" stopColor="#FFC839"/>
              <stop offset="0.6944" stopColor="#FFCE39"/>
              <stop offset="0.8472" stopColor="#FFEF7B"/>
              <stop offset="1" stopColor="#E09F26"/>
            </>
          ) : rank === 2 ? (
            <>
              <stop offset="0" stopColor="#9DA1A5"/>
              <stop offset="0.3" stopColor="#D5D9DC"/>
              <stop offset="0.6" stopColor="#A8ACB1"/>
              <stop offset="1" stopColor="#818588"/>
            </>
          ) : (
            <>
              <stop offset="0" stopColor="#B56F3F"/>
              <stop offset="0.3" stopColor="#D69263"/>
              <stop offset="0.6" stopColor="#B36E3E"/>
              <stop offset="1" stopColor="#915228"/>
            </>
          )}
        </linearGradient>
      </defs>
    </svg>
  );
}
