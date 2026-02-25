import React, { useMemo, useState } from "react";

const SectionSlider = ({ bgimage, image2, image3 }) => {
  const slides = useMemo(
    () => [
      {
        key: "vision",
        title: "OUR VISION",
        heading: "Empowering Innovation Through Collaboration",
        body: `Enable seamless collaboration among students, faculty,
professionals, entrepreneurs, mentors and venture capitalists to incubate
innovative ideas. We are a non-profit student organization committed to
promoting entrepreneurship at RGUKT Ongole and across India.`,
        image: bgimage,
        imageRight: false,
      },
      {
        key: "about",
        title: "ABOUT US",
        heading: null,
        body: `E-Cell RGUKT Ongole is a student-driven platform dedicated to
nurturing innovation, leadership, and entrepreneurial skills among young minds.
We aim to inspire curiosity, encourage problem-solving, and empower the next
generation of entrepreneurs through mentorship, workshops, speaker sessions,
competitions, and real-world startup exposure.`,
        image: image2,
        imageRight: true,
      },
      {
        key: "mission",
        title: "OUR MISSION",
        heading: null,
        body: `Our mission is to cultivate an entrepreneurial culture at RGUKT Ongole by
empowering students with the skills, mentorship, and opportunities needed
to transform ideas into impactful ventures. Through learning, collaboration,
and real-world exposure, we inspire innovation and leadership.`,
        image: image3,
        imageRight: false,
      },
    ],
    [bgimage, image2, image3]
  );

  const [active, setActive] = useState(0);

  const prev = () => setActive((i) => (i === 0 ? slides.length - 1 : i - 1));
  const next = () => setActive((i) => (i === slides.length - 1 ? 0 : i + 1));

  return (
    <section className="bg-white py-6 md:py-8">
      <div className="mx-auto max-w-6xl px-4">
        {/* Top controls (tabs + arrows) */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
            {slides.map((s, idx) => (
              <button
                key={s.key}
                onClick={() => setActive(idx)}
                className={[
                  "rounded-full border px-4 py-2 text-sm font-semibold transition",
                  idx === active
                    ? "border-[#0B2E5F] bg-[#0B2E5F] text-white"
                    : "border-[#0B2E5F]/20 bg-white text-[#0B2E5F] hover:bg-[#0B2E5F]/5",
                ].join(" ")}
              >
                {s.title}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-center gap-2 md:justify-end">
            <button
              onClick={prev}
              className="rounded-full border border-[#0B2E5F]/20 bg-white px-3 py-2 text-[#0B2E5F] shadow-sm hover:bg-[#0B2E5F]/5"
              aria-label="Previous"
            >
              ‹
            </button>
            <button
              onClick={next}
              className="rounded-full border border-[#0B2E5F]/20 bg-white px-3 py-2 text-[#0B2E5F] shadow-sm hover:bg-[#0B2E5F]/5"
              aria-label="Next"
            >
              ›
            </button>
          </div>
        </div>

        {/* Slider viewport */}
        <div className="mt-6 overflow-hidden rounded-2xl">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${active * 100}%)` }}
          >
            {slides.map((s) => (
              <div key={s.key} className="w-full flex-none">
                <div className="grid gap-6 md:grid-cols-5 md:items-stretch">
                  {/* Image (left or right depending on slide) */}
                  {!s.imageRight && (
                    <div className="md:col-span-2 relative overflow-hidden rounded-2xl border border-[#0B2E5F]/10 shadow-md">
                      <img
                        src={s.image}
                        alt={s.title}
                        className="h-[150px] md:h-[220px] w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-tr from-[#0B2E5F]/30 via-transparent to-transparent" />
                    </div>
                  )}

                  {/* Text */}
                  <div className="md:col-span-3 rounded-2xl border border-[#0B2E5F]/10 bg-[#0B2E5F]/[0.04] p-6 md:p-8 shadow-sm">
                    <div className="text-center md:text-left">
                      <h2 className="text-2xl md:text-3xl font-extrabold text-[#0B2E5F] tracking-tight">
                        {s.title}
                      </h2>
                      <div className="mx-auto md:mx-0 mt-3 h-1 w-14 rounded-full bg-[#0B2E5F]" />
                    </div>

                    {s.heading && (
                      <h3 className="mt-5 text-xl md:text-2xl font-bold text-[#0B2E5F] leading-snug">
                        {s.heading}
                      </h3>
                    )}

                    <p className="mt-4 text-base md:text-lg leading-8 text-slate-700 whitespace-pre-line">
                      {s.body}
                    </p>

                    {/* Dots */}
                    <div className="mt-6 flex items-center justify-center md:justify-start gap-2">
                      {slides.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActive(idx)}
                          className={[
                            "h-2.5 rounded-full transition-all",
                            idx === active ? "w-8 bg-[#0B2E5F]" : "w-2.5 bg-[#0B2E5F]/30",
                          ].join(" ")}
                          aria-label={`Go to slide ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </div>

                  {s.imageRight && (
                    <div className="md:col-span-2 relative overflow-hidden rounded-2xl border border-[#0B2E5F]/10 shadow-md">
                      <img
                        src={s.image}
                        alt={s.title}
                        className="h-[150px] md:h-[220px] w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-tr from-[#0B2E5F]/30 via-transparent to-transparent" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SectionSlider;
