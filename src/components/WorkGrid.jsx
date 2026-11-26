import { useState, useEffect, useCallback } from "react";

const categories = ["All", "Branding", "Mockup", "Flyer", "Event"];

export default function WorkGrid({ items }) {
  const [active, setActive] = useState("All");
  const [openIndex, setOpenIndex] = useState(null);
  const [touchX, setTouchX] = useState(null);

  const shown = active === "All" ? items : items.filter((i) => i.category === active);
  const close = () => setOpenIndex(null);
  const step = useCallback(
    (d) => setOpenIndex((i) => (i === null ? null : (i + d + shown.length) % shown.length)),
    [shown.length]
  );

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [openIndex, step]);

  const current = openIndex !== null ? shown[openIndex] : null;

  return (
    <>
      <div className="mb-10 flex flex-wrap gap-2">
        {categories.map((c) => {
          const count = c === "All" ? items.length : items.filter((i) => i.category === c).length;
          return (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`border px-5 py-2.5 text-sm transition-colors ${
                active === c
                  ? "border-brand bg-brand text-white"
                  : "border-ink hover:border-brand hover:text-brand"
              }`}
            >
              {c} <span className="opacity-60">{count}</span>
            </button>
          );
        })}
      </div>

      <div className="columns-2 gap-4 md:columns-3 md:gap-6">
        {shown.map((p, i) => (
          <button
            key={p.slug}
            id={p.slug}
            onClick={() => setOpenIndex(i)}
            className="group mb-4 block w-full break-inside-avoid text-left md:mb-6"
          >
            <div className="relative overflow-hidden bg-tint">
              <img
                src={p.src}
                width={p.width}
                height={p.height}
                alt={p.alt}
                loading="lazy"
                className="w-full transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 hidden flex-col justify-end bg-linear-to-t from-black/75 via-transparent to-transparent p-5 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 md:flex">
                <small className="text-[11px] tracking-[2px] text-white/80">
                  {p.category.toUpperCase()}
                </small>
                <p className="translate-y-2 font-serif text-xl transition-transform duration-300 group-hover:translate-y-0">
                  {p.title}
                </p>
              </div>
            </div>
            <p className="mt-2 text-sm md:hidden">{p.title}</p>
          </button>
        ))}
      </div>

      {current && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={close}
          onTouchStart={(e) => setTouchX(e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX === null) return;
            const dx = e.changedTouches[0].clientX - touchX;
            if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
            setTouchX(null);
          }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 p-6"
        >
          <img
            src={current.full}
            alt={current.alt}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[80vh] max-w-full object-contain"
          />
          <p className="mt-4 font-serif text-lg text-white">{current.title}</p>
          <button aria-label="Close" className="absolute right-6 top-4 text-4xl text-white">×</button>
          <button
            aria-label="Previous"
            onClick={(e) => { e.stopPropagation(); step(-1); }}
            className="absolute left-4 top-1/2 text-5xl text-white"
          >‹</button>
          <button
            aria-label="Next"
            onClick={(e) => { e.stopPropagation(); step(1); }}
            className="absolute right-4 top-1/2 text-5xl text-white"
          >›</button>
        </div>
      )}
    </>
  );
}