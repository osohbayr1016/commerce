"use client";

interface HeroCarouselControlsProps {
  count: number;
  currentIndex: number;
  onPrev: () => void;
  onNext: () => void;
  onGoTo: (index: number) => void;
}

export default function HeroCarouselControls({
  count,
  currentIndex,
  onPrev,
  onNext,
  onGoTo,
}: HeroCarouselControlsProps) {
  if (count <= 1) return null;
  return (
    <>
      <div className="absolute bottom-3 left-0 right-0 z-10 flex justify-center gap-1.5">
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            onClick={() => onGoTo(index)}
            className={`h-1.5 rounded-full transition-all ${
              index === currentIndex ? "bg-white w-6" : "bg-white/50 w-1.5"
            }`}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>
      <button
        type="button"
        onClick={onPrev}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white md:opacity-0 md:group-hover:opacity-100 transition-opacity"
        aria-label="Previous"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        type="button"
        onClick={onNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white md:opacity-0 md:group-hover:opacity-100 transition-opacity"
        aria-label="Next"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </>
  );
}
