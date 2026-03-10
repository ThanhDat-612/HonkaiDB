"use client";

import { useState } from "react";

export default function SmartImage({
  basePath,
  name,
  alt,
  className,
  fallback = "/placeholder.png"
}) {

  const extensions = [ "png","webp", "jpg", "jpeg", "svg",];

  const [index, setIndex] = useState(0);
  const [src, setSrc] = useState(`${basePath}/${name}.${extensions[0]}`);

  const handleError = () => {
    const next = index + 1;

    if (next < extensions.length) {
      setIndex(next);
      setSrc(`${basePath}/${name}.${extensions[next]}`);
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
    />
  );
}