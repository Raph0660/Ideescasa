'use client'; // Autorise l'interactivité côté client pour le onError

export default function SafeImage({ src, alt, fallbackUrl, className }) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={(e) => {
        if (fallbackUrl) {
          // Si l'image principale casse, on injecte l'image de secours
          e.currentTarget.src = fallbackUrl;
        }
      }}
    />
  );
}
