import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ShimmerButton } from '@/components/magicui/shimmer-button';

gsap.registerPlugin(useGSAP);

export default function TitleScreen({ onStart }) {
  const container = useRef(null);

  const { contextSafe } = useGSAP(
    () => {
      // Timeline = sunod-sunod na animation, parang storyboard
      const tl = gsap.timeline({ defaults: { ease: 'back.out(1.7)' } });

      tl.from('.ts-logo', { y: -300, duration: 1, ease: 'bounce.out' })
        .from('.ts-district', { opacity: 0, y: 10, duration: 0.4 }, '-=0.3')
        .from('.ts-match', { x: -250, opacity: 0, duration: 0.6 })
        .from('.ts-right', { x: 250, opacity: 0, duration: 0.6 }, '<')
        .from('.ts-dot', { scale: 0, duration: 0.3, stagger: 0.1 })
        .from('.ts-it', { scale: 0, rotation: -180, duration: 0.7 })
        .from('.ts-sub', { opacity: 0, y: 20, duration: 0.4, stagger: 0.15 })
        .from('.ts-btn', { opacity: 0, y: 30, scale: 0.8, duration: 0.5, stagger: 0.12 })
        // Pagkatapos ng lahat: pa-ugoy-ugoy ang "IT" habang buhay
        .to('.ts-it', { rotation: 6, duration: 0.8, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    },
    { scope: container } // .ts-* sa loob lang ng component na ito ang hahanapin
  );

  // contextSafe: para malinis din ng useGSAP ang animation na galing sa click
  const handleStart = contextSafe((lang) => {
    gsap.to(container.current, {
      opacity: 0,
      scale: 0.95,
      duration: 0.4,
      ease: 'power2.in',
      onComplete: () => onStart(lang), // lilipat lang pag tapos na ang fade out
    });
  });

  return (
    <div
      ref={container}
      className="relative min-h-screen flex flex-col items-center justify-center px-4 py-8 text-center overflow-hidden"
    >
      {/* Mga dekorasyon sa background (gaya ng title slide) */}
      <div className="absolute -top-24 -right-24 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-white/10" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 sm:w-md sm:h-112 rounded-full bg-white/10" />
      <div className="absolute top-[12%] left-[14%] w-4 h-4 rounded-full bg-amber-400" />
      <div className="absolute bottom-[12%] right-[14%] w-6 h-6 rounded-full bg-amber-400" />

      {/* Logo */}
      <img
        src="/cws-logo.png"
        alt="CWS Logo"
        className="ts-logo relative w-24 h-24 sm:w-32 sm:h-32 object-cover [clip-path:circle(49%_at_center)] drop-shadow-lg"
      />

      <p className="ts-district relative mt-3 text-white font-extrabold text-xl sm:text-3xl">
        Metro Manila South
      </p>

      {/* MATCH • IT • RIGHT */}
      <div className="relative flex items-center justify-center mt-6 sm:mt-8">
        <div className="ts-match bg-white rounded-2xl sm:rounded-3xl px-3 sm:px-8 py-2 sm:py-3 shadow-[0_6px_0_#0b6aa3]">
          <span className="text-sky-950 font-black text-3xl sm:text-7xl tracking-tight">MATCH</span>
        </div>

        <span className="ts-dot w-3 h-3 sm:w-5 sm:h-5 rounded-full bg-amber-400 -mx-0.5 z-10" />

        <div className="ts-it bg-amber-400 border-4 border-dashed border-amber-100 rounded-xl px-2 sm:px-4 py-1 sm:py-2 shadow-[0_6px_0_#d97706] z-20">
          <span className="text-sky-950 font-black text-2xl sm:text-5xl">IT</span>
        </div>

        <span className="ts-dot w-3 h-3 sm:w-5 sm:h-5 rounded-full bg-amber-400 -mx-0.5 z-10" />

        <div className="ts-right bg-white rounded-2xl sm:rounded-3xl px-3 sm:px-8 py-2 sm:py-3 shadow-[0_6px_0_#0b6aa3]">
          <span className="text-sky-950 font-black text-3xl sm:text-7xl tracking-tight">RIGHT</span>
        </div>
      </div>

      <p className="ts-sub relative mt-6 text-white font-semibold text-base sm:text-2xl">
        Match the words from Column A to Column B!
      </p>
      <p className="ts-sub relative mt-2 text-white font-extrabold text-lg sm:text-3xl">
        Visitation Activity
      </p>

       {/* Pagpili ng wika */}
      <div className="relative flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8 w-full max-w-sm sm:max-w-md">
        {/* Ang wrapper (.ts-btn) ang ina-animate ng GSAP, hindi ang button mismo */}
        <div className="ts-btn flex-1">
          <ShimmerButton
            onClick={() => handleStart('tl')}
            background="#f59e0b"
            shimmerColor="#fff7d6"
            borderRadius="16px"
            className="w-full text-sky-950 font-black text-lg border-b-4 border-amber-700 shadow-xl"
          >
            Tagalog
          </ShimmerButton>
        </div>

        <div className="ts-btn flex-1">
          <ShimmerButton
            onClick={() => handleStart('en')}
            background="#10b981"
            shimmerColor="#d1fae5"
            borderRadius="16px"
            className="w-full text-white font-black text-lg border-b-4 border-emerald-700 shadow-xl"
          >
            English
          </ShimmerButton>
        </div>
      </div>
    </div>
  );
}