import React, { useRef, useState, useEffect } from 'react';
import HTMLFlipBook from 'react-pageflip';

/*
  Layout modes
  ------------
  spread : two pages side by side (open book). Used on laptops/desktops and
           landscape tablets: width >= 900, height >= 560, and landscape-ish.
  single : one page fills the screen. Used on phones (portrait or landscape)
           and portrait tablets.
*/
const getLayout = () => {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const spread = w >= 900 && h >= 560 && w / h >= 1.15;
  return { w, h, spread };
};

// Each page is a flex column: scrollable content area + pinned page-number footer.
const Page = React.forwardRef((props, ref) => {
  return (
    <div
      ref={ref}
      className="bg-[#f2efe9] text-[#2c2825] h-full w-full flex flex-col relative overflow-hidden border-r border-[#e0dad0] select-none"
    >
      {/* Dotted paper texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5dec9_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

      <div className="relative z-10 flex-1 min-h-0 flex flex-col justify-between gap-6 p-[6vmin] overflow-y-auto">
        {props.children}
      </div>

      <div className="relative z-10 text-xs text-stone-400 text-center font-mono pb-6 pt-2">
        - {props.number} -
      </div>
    </div>
  );
});

export default function BookPortfolio() {
  const bookRef = useRef(null);
  const currentPage = useRef(0); // remembered so a resize/rotation doesn't reset the book
  const [layout, setLayout] = useState(getLayout);

  // Debounced resize / rotation handling
  useEffect(() => {
    let t;
    const onResize = () => {
      clearTimeout(t);
      t = setTimeout(() => setLayout(getLayout()), 200);
    };
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    return () => {
      clearTimeout(t);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
    };
  }, []);

  const { w, h, spread } = layout;

  // flip() is zero-based: index 0 = page 1, index 5 = page 6
  const goToPage = (index) => bookRef.current?.pageFlip().flip(index);
  const flipPrev = () => bookRef.current?.pageFlip().flipPrev();

  // Book sizing
  // spread: one page = half the screen width, full height
  // single: one page = the whole screen. The library only switches to its
  //         one-page "portrait" mode when the container is narrower than
  //         2 x minWidth, so minWidth is set just over half the screen width.
  const pageW = spread ? Math.floor(w / 2) : w;
  const pageH = h;
  const minWidth = spread ? 200 : Math.round(w * 0.6);

  // When switching modes, keep the reader on (roughly) the same page.
  const startPage = spread ? currentPage.current - (currentPage.current % 2) : currentPage.current;

  return (
    <div className="fixed inset-0 bg-[#111615] overflow-hidden">
      <HTMLFlipBook
        key={`${spread ? 'spread' : 'single'}-${w}x${h}`}
        ref={bookRef}
        width={pageW}
        height={pageH}
        size="stretch"
        minWidth={minWidth}
        maxWidth={4000}
        minHeight={Math.min(300, h)}
        maxHeight={4000}
        maxShadowOpacity={0.5}
        showCover={false}
        usePortrait={!spread}
        startPage={startPage}
        flippingTime={spread ? 900 : 700}
        mobileScrollSupport={true}
        onFlip={(e) => {
          currentPage.current = e.data;
        }}
        className="!w-full !h-full"
        style={{ width: '100%', height: '100%' }}
      >
        {/* PAGE 1: Intro */}
        <Page number={1}>
          <div className="space-y-6 pt-4 sm:pt-8">
            <span className="bg-emerald-900 text-emerald-100 text-xs tracking-widest uppercase px-3 py-1 rounded-full font-sans inline-block">
              Digital Journal & Portfolio
            </span>
            <h1 className="text-[clamp(2.5rem,9vmin,6rem)] font-normal tracking-tight text-stone-900 leading-tight">
              Tanmayee <br />
              <span className="italic font-light text-stone-600">Pemmaraju</span>
            </h1>
            <p className="text-stone-600 text-[clamp(0.95rem,2.2vmin,1.4rem)] leading-relaxed font-sans max-w-lg">
              A curated exploration of code, creative interface design, and modern software
              engineering. Built completely from scratch as an interactive web artifact.
            </p>
          </div>
          <div className="border-t border-stone-300 pt-4 text-xs font-sans text-stone-500 uppercase tracking-wider">
            {spread
              ? '[ Use corner turns or index to navigate → ]'
              : '[ Swipe or tap a corner to turn the page → ]'}
          </div>
        </Page>

        {/* PAGE 2: Table of Contents */}
        <Page number={2}>
          <div className="pt-4 sm:pt-8">
            <h3 className="text-xs sm:text-sm font-sans uppercase tracking-widest text-emerald-900 font-bold mb-8 border-b border-stone-300 pb-3">
              Table of Contents
            </h3>

            <ul className="space-y-6 font-sans text-[clamp(1rem,2.4vmin,1.6rem)]">
              <li>
                <button
                  onClick={() => goToPage(2)}
                  className="w-full text-left group flex justify-between items-baseline hover:text-emerald-800 transition-colors cursor-pointer"
                >
                  <span className="group-hover:translate-x-2 transition-transform font-medium">
                    01. Project Alpha: Neural Canvas
                  </span>
                  <span className="text-stone-400 text-xs font-mono ml-4 shrink-0">p. 3</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => goToPage(4)}
                  className="w-full text-left group flex justify-between items-baseline hover:text-emerald-800 transition-colors cursor-pointer"
                >
                  <span className="group-hover:translate-x-2 transition-transform font-medium">
                    02. Project Beta: Archive OS
                  </span>
                  <span className="text-stone-400 text-xs font-mono ml-4 shrink-0">p. 5</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => goToPage(5)}
                  className="w-full text-left group flex justify-between items-baseline hover:text-emerald-800 transition-colors cursor-pointer"
                >
                  <span className="group-hover:translate-x-2 transition-transform font-medium">
                    03. Technical Notes & Skills
                  </span>
                  <span className="text-stone-400 text-xs font-mono ml-4 shrink-0">p. 6</span>
                </button>
              </li>
            </ul>
          </div>

          <div className="text-xs font-sans text-stone-500 italic">
            {spread
              ? 'Click any section above to flip directly to its spread.'
              : 'Tap any section above to jump straight to it.'}
          </div>
        </Page>

        {/* PAGE 3: Project 1 */}
        <Page number={3}>
          <div className="space-y-6 pt-4 sm:pt-8">
            <span className="text-xs font-sans text-emerald-800 uppercase tracking-widest font-semibold">
              Featured Work 01
            </span>
            <h2 className="text-[clamp(2rem,5vmin,4rem)] font-normal text-stone-900">
              Neural Canvas
            </h2>
            <p className="text-[clamp(0.95rem,2.2vmin,1.3rem)] font-sans text-stone-600 leading-relaxed">
              An experimental generative workspace designed to explore real-time UI layouts and
              state manipulation.
            </p>
            <div className="bg-stone-300/80 h-[30vh] rounded flex items-center justify-center text-sm font-sans text-stone-600 border border-stone-400 shadow-inner">
              [ Project Visual Mockup ]
            </div>
          </div>
          <div className="text-xs font-sans text-stone-400">
            {spread ? 'Continued on right page →' : 'Continued on next page →'}
          </div>
        </Page>

        {/* PAGE 4: Project 1 Details */}
        <Page number={4}>
          <div className="space-y-6 pt-4 sm:pt-8">
            <h3 className="text-xs font-sans uppercase tracking-widest text-stone-500 font-semibold">
              Technical Highlights
            </h3>
            <ul className="space-y-3 text-[clamp(0.9rem,2vmin,1.3rem)] font-sans text-stone-700 list-disc pl-5">
              <li>Optimized custom React hooks for state persistence.</li>
              <li>Modular page architecture with smooth 3D CSS physics.</li>
              <li>Zero external UI framework dependencies.</li>
            </ul>
            <div className="pt-6">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="inline-block bg-stone-900 text-stone-100 text-xs uppercase tracking-wider font-sans px-6 py-3 rounded hover:bg-emerald-900 transition-colors"
              >
                View Project Code &rarr;
              </a>
            </div>
          </div>
          <div className="text-right">
            <button
              onClick={() => goToPage(1)}
              className="text-xs font-sans text-stone-400 hover:text-emerald-800 transition-colors cursor-pointer py-2"
            >
              &larr; Back to Contents
            </button>
          </div>
        </Page>

        {/* PAGE 5: Project 2 */}
        <Page number={5}>
          <div className="space-y-6 pt-4 sm:pt-8">
            <span className="text-xs font-sans text-emerald-800 uppercase tracking-widest font-semibold">
              Featured Work 02
            </span>
            <h2 className="text-[clamp(2rem,5vmin,4rem)] font-normal text-stone-900">Archive OS</h2>
            <p className="text-[clamp(0.95rem,2.2vmin,1.3rem)] font-sans text-stone-600 leading-relaxed">
              A documentation engine inspired by vintage field journals and technical manuals,
              focused heavily on custom typography.
            </p>
          </div>
          <div>
            <button
              onClick={flipPrev}
              className="text-xs font-sans text-stone-400 hover:text-emerald-800 transition-colors cursor-pointer py-2"
            >
              &larr; Previous Page
            </button>
          </div>
        </Page>

        {/* PAGE 6: Skills */}
        <Page number={6}>
          <div className="space-y-6 pt-4 sm:pt-8">
            <h3 className="text-xs font-sans uppercase tracking-widest text-stone-500 font-semibold">
              Skills & Stack
            </h3>
            <div className="grid grid-cols-2 gap-4 text-[clamp(0.85rem,2vmin,1.2rem)] font-sans text-stone-700">
              <div className="p-3 bg-stone-200/60 rounded border border-stone-300">React & Vite</div>
              <div className="p-3 bg-stone-200/60 rounded border border-stone-300">Tailwind CSS</div>
              <div className="p-3 bg-stone-200/60 rounded border border-stone-300">
                JavaScript (ES6+)
              </div>
              <div className="p-3 bg-stone-200/60 rounded border border-stone-300">
                GitHub Actions
              </div>
            </div>
          </div>
          <div className="text-xs font-sans text-stone-400 text-right">End of Journal</div>
        </Page>
      </HTMLFlipBook>
    </div>
  );
}