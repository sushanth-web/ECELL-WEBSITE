import React, { useMemo, useState, useEffect, useCallback } from "react";
import image1 from "../utils/images/1.jpeg";
import image2 from "../utils/images/5.jpeg";
import image3 from "../utils/images/10.jpeg";

const AUTO_DELAY = 4000;
const SWIPE_THRESHOLD = 50;

const InfoSlider = ({ className = "" }) => {

  const slides = useMemo(() => [
    {
      heading: "Empowering Innovation Through Collaboration",
      text: `Enable seamless collaboration among students, faculty, professionals, entrepreneurs, mentors and venture capitalists to incubate innovative ideas.`,
      image: image1,
      reverse: false,
    },
    {
      heading: "Student-driven, Impact-focused",
      text: `E-Cell RGUKT Ongole is a student-driven platform dedicated to nurturing innovation, leadership, and entrepreneurial skills among young minds.`,
      image: image2,
      reverse: true,
    },
    {
      heading: "Turning Ideas into Ventures",
      text: `We empower students with skills, mentorship, and opportunities needed to transform ideas into impactful ventures.`,
      image: image3,
      reverse: false,
    }
  ], []);

  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);

  const total = slides.length;

const goPrev = () => {
  setActive(prev => prev === 0 ? total - 1 : prev - 1);
};

const goNext = useCallback(() => {
  setActive((prev) => (prev + 1) % slides.length);
}, [slides.length]);

useEffect(() => {
  if (isPaused) return;

  const interval = setInterval(goNext, AUTO_DELAY);
  return () => clearInterval(interval);
}, [goNext, isPaused]);

  const handleTouchStart = (e) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {

    if (!touchStartX || !touchEndX) return;

    const distance = touchStartX - touchEndX;

    if (distance > SWIPE_THRESHOLD) {
      goNext();
    }

    if (distance < -SWIPE_THRESHOLD) {
      goPrev();
    }

    setTouchStartX(null);
    setTouchEndX(null);
  };

  return (
    <section className={`bg-gradient-to-b from-white to-slate-50 py-12 ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">

        <div
          className="relative rounded-3xl bg-white shadow-xl border border-slate-200 overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >

          {/* Prev */}
          <button
            onClick={goPrev}
            className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 z-10
            h-11 w-11 rounded-full bg-white shadow-md border
            items-center justify-center text-[#0B2E5F] text-xl
            hover:scale-110 transition"
          >
            ‹
          </button>

          {/* Next */}
          <button
            onClick={goNext}
            className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 z-10
            h-11 w-11 rounded-full bg-white shadow-md border
            items-center justify-center text-[#0B2E5F] text-xl
            hover:scale-110 transition"
          >
            ›
          </button>

          {/* Slides */}
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${active * 100}%)` }}
          >
            {slides.map((s, idx) => (
              <div key={idx} className="min-w-full p-6 md:p-10">

                <div className={`grid gap-8 items-center md:grid-cols-2 ${s.reverse ? "md:[&>div:first-child]:order-2" : ""}`}>

                  <div className="overflow-hidden rounded-2xl shadow-lg">
                    <img
                      src={s.image}
                      alt={s.heading}
                      className="w-full object-cover h-[180px] sm:h-[220px] md:h-[260px] lg:h-[280px]"
                    />
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-2xl md:text-3xl font-bold text-[#0B2E5F]">
                      {s.heading}
                    </h3>
                    <p className="text-slate-600 leading-relaxed text-base md:text-lg">
                      {s.text}
                    </p>
                  </div>

                </div>

              </div>
            ))}
          </div>

          {/* Dots */}
          <div className="pb-6 flex justify-center gap-3">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`h-3 rounded-full transition-all ${
                  active === i
                    ? "bg-[#0B2E5F] w-8"
                    : "bg-slate-300 w-3 hover:bg-slate-400"
                }`}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default InfoSlider;