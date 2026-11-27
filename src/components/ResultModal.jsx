import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import confetti from 'canvas-confetti';
import { SparklesText } from '@/components/magicui/sparkles-text';
import { BorderBeam } from '@/components/magicui/border-beam';

gsap.registerPlugin(useGSAP);

// Mga kulay ng confetti: tugma sa kulay ng laro
const COLORS = ['#fbbf24', '#10b981', '#8b5cf6', '#f97316', '#ec4899', '#ffffff'];

const TEXT = {
  tl: {
    roundTitle: 'MAGALING!',
    roundMsg: (n) => `Natapos mo ang Round ${n}!`,
    next: 'Susunod na Round ➔',
    finalTitle: 'TAPOS NA!',
    finalMsg: 'Napagtugma mo ang lahat ng 12 pares!',
    mistakes: 'Mali',
    rating: { 3: 'Perpekto! 🌟', 2: 'Ang galing!', 1: 'Kaya mo pa! Subukan ulit.' },
    again: 'Maglaro Ulit 🔄',
    menu: 'Menu',
  },
  en: {
    roundTitle: 'GREAT JOB!',
    roundMsg: (n) => `You finished Round ${n}!`,
    next: 'Next Round ➔',
    finalTitle: 'ALL DONE!',
    finalMsg: 'You matched all 12 pairs!',
    mistakes: 'Mistakes',
    rating: { 3: 'Perfect! 🌟', 2: 'Great job!', 1: 'Keep practicing!' },
    again: 'Play Again 🔄',
    menu: 'Menu',
  },
};

// Ilang bituin batay sa bilang ng mali
function getStars(mistakes) {
  if (mistakes <= 1) return 3;
  if (mistakes <= 4) return 2;
  return 1;
}

// Confetti: maliit pagkatapos ng round, malaki sa dulo ng laro
function celebrate(big) {
  if (!big) {
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 }, colors: COLORS });
    return;
  }
  confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 }, colors: COLORS });
  confetti({ particleCount: 80, angle: 60, spread: 60, origin: { x: 0, y: 0.7 }, colors: COLORS });  // mula kaliwa
  confetti({ particleCount: 80, angle: 120, spread: 60, origin: { x: 1, y: 0.7 }, colors: COLORS }); // mula kanan
}

export default function ResultModal({ type, lang, round, mistakes, onNext, onRestart, onMenu }) {
  const ref = useRef(null);
  const t = TEXT[lang];
  const isFinal = type === 'final';
  const stars = getStars(mistakes);

  const { contextSafe } = useGSAP(
    () => {
      // delay: hintayin munang matapos iguhit ang huling linya
      const tl = gsap.timeline({ delay: 0.7 });

      tl.from(ref.current, { opacity: 0, duration: 0.3 })
        .from('.rm-card', { scale: 0.5, opacity: 0, duration: 0.5, ease: 'back.out(1.8)' }, '<0.1')
        .from('.rm-badge', { y: -40, rotation: -20, opacity: 0, duration: 0.4, ease: 'back.out(2)' }, '-=0.2')
        .call(() => celebrate(isFinal)); // .call = magpatakbo ng function sa puntong ito ng timeline

      if (isFinal) {
        tl.from('.rm-star', { scale: 0, rotation: -180, duration: 0.5, stagger: 0.2, ease: 'back.out(2)' });
      }

      tl.from('.rm-btn', { y: 20, opacity: 0, duration: 0.3, stagger: 0.1 });
    },
    { scope: ref }
  );

  // Pagsara: mag-fade out muna, tapos gawin ang action
  const close = contextSafe((action) => {
    gsap.set(ref.current, { pointerEvents: 'none' }); // iwas double-click habang nagsasara
    gsap.to(ref.current, { opacity: 0, duration: 0.25, onComplete: action });
  });

  return (
    <div
      ref={ref}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sky-950/60 backdrop-blur-sm"
    >
      <div className="rm-card relative w-full max-w-sm bg-white rounded-3xl px-6 pt-12 pb-6 text-center border-4 border-amber-300 shadow-2xl">
        {/* Badge sa itaas. Ginamit ang -ml-10 sa halip na -translate-x-1/2,
            para walang nagagalaw na transform ang CSS habang ina-animate ito ng GSAP */}
        <div className="rm-badge absolute -top-10 left-1/2 -ml-10 w-20 h-20 rounded-full bg-emerald-500 border-4 border-white shadow-lg flex items-center justify-center text-4xl">
          {isFinal ? '🏆' : '🎉'}
        </div>

        <SparklesText
          className="text-3xl font-black text-emerald-600 uppercase tracking-wide"
          colors={{ first: '#fbbf24', second: '#ec4899' }}
          sparklesCount={8}
        >
          {isFinal ? t.finalTitle : t.roundTitle}
        </SparklesText>
        <p className="mt-2 text-gray-700 font-semibold">
          {isFinal ? t.finalMsg : t.roundMsg(round)}
        </p>

        {/* Mga bituin: sa dulo lang ng laro */}
        {isFinal && (
          <>
            <div className="flex justify-center gap-2 mt-4">
              {[1, 2, 3].map((n) => (
                <span key={n} className={`rm-star text-5xl ${n <= stars ? '' : 'grayscale opacity-30'}`}>
                  ⭐
                </span>
              ))}
            </div>
            <p className="mt-2 text-sky-900 font-extrabold text-lg">{t.rating[stars]}</p>
            <p className="text-gray-500 font-semibold text-sm">
              {t.mistakes}: {mistakes}
            </p>
          </>
        )}

        {/* Mga button */}
        <div className="mt-6 flex flex-col gap-3">
          {isFinal ? (
            <>
              <button
                onClick={() => close(onRestart)}
                className="rm-btn w-full bg-amber-400 hover:bg-amber-300 text-sky-950 font-black px-6 py-3 rounded-2xl border-b-4 border-amber-600 shadow-lg uppercase tracking-wide transition-colors"
              >
                {t.again}
              </button>
              <button
                onClick={() => close(onMenu)}
                className="rm-btn w-full bg-sky-500 hover:bg-sky-400 text-white font-black px-6 py-3 rounded-2xl border-b-4 border-sky-700 shadow-lg uppercase tracking-wide transition-colors"
              >
                {t.menu}
              </button>
            </>
          ) : (
            <button
              onClick={() => close(onNext)}
              className="rm-btn w-full bg-amber-400 hover:bg-amber-300 text-sky-950 font-black px-6 py-3 rounded-2xl border-b-4 border-amber-600 shadow-lg uppercase tracking-wide transition-colors"
            >
              {t.next}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}