import { useState, useCallback } from 'react';
import { HiX, HiChevronLeft, HiChevronRight, HiPlay } from 'react-icons/hi';

// Cloudinary v1 + multer-storage-cloudinary v4 can store video URLs as /image/upload/.
// Fix them to /video/upload/ so browsers can play them.
function toVideoUrl(url) {
  if (!url) return url;
  return url.replace('/image/upload/', '/video/upload/');
}

function LightboxModal({ items, currentIndex, onClose, onPrev, onNext }) {
  const item = items[currentIndex];
  const isVideo = item?.type === 'video';

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white/70 hover:text-accent transition-colors z-10"
        aria-label="Close"
      >
        <HiX size={28} />
      </button>

      {/* Counter */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 text-white/50 text-sm font-sans">
        {currentIndex + 1} / {items.length}
      </div>

      {/* Prev */}
      {currentIndex > 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className="absolute left-4 md:left-10 text-white/70 hover:text-accent transition-colors z-10 bg-black/30 p-2"
          aria-label="Previous"
        >
          <HiChevronLeft size={32} />
        </button>
      )}

      {/* Media */}
      <div
        className="max-w-5xl max-h-[85vh] mx-14 flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {isVideo ? (
          <video
            controls
            autoPlay
            playsInline
            crossOrigin="anonymous"
            className="max-h-[80vh] max-w-full"
          >
            <source src={item.src} type="video/mp4" />
            <source src={item.src} type="video/webm" />
            Your browser does not support video playback.
          </video>
        ) : (
          <img
            src={item.src}
            alt={`Media ${currentIndex + 1}`}
            className="max-h-[85vh] max-w-full object-contain"
          />
        )}
      </div>

      {/* Next */}
      {currentIndex < items.length - 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="absolute right-4 md:right-10 text-white/70 hover:text-accent transition-colors z-10 bg-black/30 p-2"
          aria-label="Next"
        >
          <HiChevronRight size={32} />
        </button>
      )}
    </div>
  );
}

export default function Gallery({ images = [], videos = [] }) {
  const [lightboxIndex, setLightboxIndex] = useState(null);

  // Combine images + videos into one array; fix Cloudinary video URLs
  const allItems = [
    ...images.map((src) => ({ src, type: 'image' })),
    ...videos.map((src) => ({ src: toVideoUrl(src), type: 'video' })),
  ];

  const openLightbox = useCallback((index) => setLightboxIndex(index), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const goPrev = useCallback(() => setLightboxIndex((i) => Math.max(0, i - 1)), []);
  const goNext = useCallback(
    () => setLightboxIndex((i) => Math.min(allItems.length - 1, i + 1)),
    [allItems.length]
  );

  if (allItems.length === 0) return null;

  // Instagram-style layout: first image big, rest in a 3-col grid
  const featured = allItems[0];
  const rest = allItems.slice(1);

  return (
    <div>
      {/* Featured + first 4 in a bento grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {/* Hero image – spans 2 cols and 2 rows */}
        <div
          className="col-span-2 row-span-2 relative overflow-hidden cursor-pointer group aspect-square md:aspect-auto"
          onClick={() => openLightbox(0)}
          style={{ gridRow: 'span 2' }}
        >
          {featured.type === 'video' ? (
            <video className="w-full h-full object-cover" muted playsInline crossOrigin="anonymous">
              <source src={featured.src} type="video/mp4" />
              <source src={featured.src} type="video/webm" />
            </video>
          ) : (
            <img
              src={featured.src}
              alt="Featured"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              style={{ minHeight: '300px' }}
            />
          )}
          <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/30 transition-all duration-300 flex items-center justify-center">
            {featured.type === 'video' && (
              <HiPlay className="text-white opacity-80" size={48} />
            )}
          </div>
        </div>

        {/* Remaining items */}
        {rest.slice(0, 4).map((item, idx) => (
          <div
            key={idx}
            className="relative overflow-hidden cursor-pointer group aspect-square"
            onClick={() => openLightbox(idx + 1)}
          >
            {item.type === 'video' ? (
              <video className="w-full h-full object-cover" muted playsInline crossOrigin="anonymous">
                <source src={item.src} type="video/mp4" />
                <source src={item.src} type="video/webm" />
              </video>
            ) : (
              <img
                src={item.src}
                alt={`Photo ${idx + 2}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            )}
            <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/30 transition-all duration-300 flex items-center justify-center">
              {item.type === 'video' && (
                <HiPlay className="text-white opacity-80" size={32} />
              )}
              {/* Show "+N more" on last visible tile */}
              {idx === 3 && rest.length > 4 && (
                <div className="absolute inset-0 bg-primary/60 flex items-center justify-center">
                  <span className="text-cream font-serif text-2xl">+{rest.length - 4}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* All photos strip below if > 5 */}
      {rest.length > 4 && (
        <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {rest.slice(4).map((item, idx) => (
            <div
              key={idx}
              className="relative overflow-hidden cursor-pointer group aspect-square"
              onClick={() => openLightbox(idx + 5)}
            >
              {item.type === 'video' ? (
                <video className="w-full h-full object-cover" muted playsInline crossOrigin="anonymous">
                  <source src={item.src} type="video/mp4" />
                  <source src={item.src} type="video/webm" />
                </video>
              ) : (
                <img
                  src={item.src}
                  alt={`Photo ${idx + 6}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/30 transition-all duration-300 flex items-center justify-center">
                {item.type === 'video' && (
                  <HiPlay className="text-white opacity-70" size={24} />
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <LightboxModal
          items={allItems}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onPrev={goPrev}
          onNext={goNext}
        />
      )}
    </div>
  );
}
