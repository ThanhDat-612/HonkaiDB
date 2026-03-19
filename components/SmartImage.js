// "use client";

// import { useState, useEffect } from "react";

// export default function SmartImage({
//   basePath,
//   name,
//   alt,
//   className,
//   fallback = "/placeholder.webp",
//   fallbackName
// }) {
//   const [src, setSrc] = useState(`${basePath}/${name}.webp`);
//   const [usedFallbackName, setUsedFallbackName] = useState(false);

//   // Reset state khi name thay đổi
//   useEffect(() => {
//     setSrc(`${basePath}/${name}.webp`);
//     setUsedFallbackName(false);
//   }, [name, basePath]);

//   const handleError = () => {
//     // Nếu có fallbackName và chưa thử, thử với fallbackName
//     if (fallbackName && !usedFallbackName) {
//       setUsedFallbackName(true);
//       setSrc(`${basePath}/${fallbackName}.webp`);
//     } else {
//       setSrc(fallback);
//     }
//   };

//   return (
//     <img
//       src={src}
//       alt={alt}
//       className={className}
//       onError={handleError}
//     />
//   );
// }
"use client";

import { useState, useEffect } from "react";

export default function SmartImage({
  basePath,
  name,
  alt,
  className,
  fallback = "/placeholder.webp",
  fallbackName,
  lazy = true, // Mặc định lazy load
}) {
  const [src, setSrc] = useState(`${basePath}/${name}.webp`);
  const [usedFallbackName, setUsedFallbackName] = useState(false);

  // Reset state khi name thay đổi
  useEffect(() => {
    setSrc(`${basePath}/${name}.webp`);
    setUsedFallbackName(false);
  }, [name, basePath]);

  const handleError = () => {
    if (fallbackName && !usedFallbackName) {
      setUsedFallbackName(true);
      setSrc(`${basePath}/${fallbackName}.webp`);
    } else {
      setSrc(fallback);
    }
  };

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={handleError}
      loading={lazy ? "lazy" : "eager"} // ✅ Lazy load
      decoding="async"                   // ✅ Non-blocking decode
    />
  );
}