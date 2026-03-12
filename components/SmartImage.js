"use client";

import { useState, useEffect } from "react";

export default function SmartImage({
  basePath,
  name,
  alt,
  className,
  fallback = "/placeholder.png",
  fallbackName // Thêm prop mới
}) {

  const extensions = ["png", "webp", "jpg", "jpeg", "svg"];
  
  // State để lưu tên file hiện tại và index
  const [currentName, setCurrentName] = useState(name);
  const [index, setIndex] = useState(0);
  const [src, setSrc] = useState(`${basePath}/${currentName}.${extensions[0]}`);

  // Reset state khi name thay đổi
  useEffect(() => {
    setCurrentName(name);
    setIndex(0);
    setSrc(`${basePath}/${name}.${extensions[0]}`);
  }, [name, basePath]);

  const handleError = () => {
    const next = index + 1;

    // Thử với extension tiếp theo
    if (next < extensions.length) {
      setIndex(next);
      setSrc(`${basePath}/${currentName}.${extensions[next]}`);
    } 
    // Nếu đã hết extension và có fallbackName, thử với fallbackName
    else if (fallbackName && currentName !== fallbackName) {
      setCurrentName(fallbackName);
      setIndex(0);
      setSrc(`${basePath}/${fallbackName}.${extensions[0]}`);
    }
    // Nếu vẫn không được, dùng fallback cuối cùng
    else {
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