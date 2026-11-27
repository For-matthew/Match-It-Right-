import { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import MatchCard from './MatchCard';
import Lines from './Lines';
import ResultModal from './ResultModal';

gsap.registerPlugin(useGSAP);

// Kulay ng bawat tamang pares, ayon sa pagkakasunod (1st, 2nd, 3rd, 4th na tama).
// Buong pangalan ng class ang nakasulat (hal. 'bg-emerald-500'), hindi binubuo,
// dahil ang buong pangalan lang ang nakikita ng Tailwind kapag hinahanap nito ang mga class.
// Ang hex ay para sa kulay ng linya sa Step 6.
const MATCH_COLORS = [
  { card: 'bg-emerald-500 text-white border-emerald-700', hex: '#10b981' },
  { card: 'bg-violet-500 text-white border-violet-700', hex: '#8b5cf6' },
  { card: 'bg-orange-500 text-white border-orange-700', hex: '#f97316' },
  { card: 'bg-pink-500 text-white border-pink-700', hex: '#ec4899' },
];

const LETTERS = ['A', 'B', 'C', 'D'];

const TEXT = {
  tl: {
    menu: 'Menu',
    mistakes: 'Mali',
    round: 'Round',
    hint: 'Pumili ng isa sa Hanay A, tapos ang katapat nito sa Hanay B.',
    colA: 'Hanay A',
    colB: 'Hanay B',
    next: 'Susunod na Round ➔',
    done: '🏆 Tapos na!',
    again: 'Maglaro Ulit',
  },
  en: {
    menu: 'Menu',
    mistakes: 'Mistakes',
    round: 'Round',
    hint: 'Tap an item in Column A, then its match in Column B.',
    colA: 'Column A',
    colB: 'Column B',
    next: 'Next Round ➔',
    done: '🏆 All done!',
    again: 'Play Again',
  },
};

export default function MatchBoard({ game }) {
  const container = useRef(null);
  const [wrong, setWrong] = useState(null); // { leftId, rightId } habang namumula
  const t = TEXT[game.lang];

    const columnsRef = useRef(null); // ang lalagyan ng dalawang column
  const [lines, setLines] = useState([]);

  // Sukatin ang posisyon ng mga tuldok at gumawa ng linya para sa bawat tamang pares
  useLayoutEffect(() => {
    function measure() {
      const wrap = columnsRef.current;
      if (!wrap) return;
      const box = wrap.getBoundingClientRect();

      // Gitna ng isang element, relatibo sa lalagyan
      const center = (el) => {
        const r = el.getBoundingClientRect();
        return { x: r.left + r.width / 2 - box.left, y: r.top + r.height / 2 - box.top };
      };

      setLines(
        game.matches.map((m, i) => {
          const a = center(wrap.querySelector(`[data-dot="left-${m.leftId}"]`));
          const b = center(wrap.querySelector(`[data-dot="right-${m.rightId}"]`));
          const bend = (b.x - a.x) / 2; // gaano kakurba

          return {
            key: `${m.leftId}-${m.rightId}`,
            color: MATCH_COLORS[i].hex,
            // C = cubic curve: lalabas nang pahalang mula A, papasok nang pahalang sa B
            d: `M ${a.x} ${a.y} C ${a.x + bend} ${a.y}, ${b.x - bend} ${b.y}, ${b.x} ${b.y}`,
          };
        })
      );
    }

    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure); // linisin kapag umalis
  }, [game.matches]);

  // Pagpasok ng mga card: tatakbo ulit tuwing may bagong board (bagong round o laro)
  const { contextSafe } = useGSAP(
    () => {
      gsap.from('.card-left', { x: -80, opacity: 0, duration: 0.5, stagger: 0.08, ease: 'back.out(1.6)' });
      gsap.from('.card-right', { x: 80, opacity: 0, duration: 0.5, stagger: 0.08, ease: 'back.out(1.6)', delay: 0.15 });
    },
    { scope: container, dependencies: [game.board], revertOnUpdate: true }
  );

  // Hanapin ang DOM element ng dalawang card gamit ang data-card
  function getCards(leftId, rightId) {
    const root = container.current;
    return [
      root.querySelector(`[data-card="left-${leftId}"]`),
      root.querySelector(`[data-card="right-${rightId}"]`),
    ];
  }

  // Mali: nanginginig pakaliwa-pakanan
  const shake = contextSafe((cards) => {
    gsap.to(cards, { keyframes: { x: [0, -12, 12, -8, 8, -4, 4, 0] }, duration: 0.5, ease: 'none' });
  });

  // Tama: lalaki saglit, tapos babalik
  const pop = contextSafe((cards) => {
    gsap.fromTo(cards, { scale: 1 }, { scale: 1.08, duration: 0.15, yoyo: true, repeat: 1, ease: 'power1.out' });
  });

  function handleSelect(side, id) {
    const result = game.select(side, id);
    if (!result || result.type === 'selected') return;

    const cards = getCards(result.leftId, result.rightId);

    if (result.type === 'correct') {
      pop(cards);
    } else {
      setWrong({ leftId: result.leftId, rightId: result.rightId });
      shake(cards);
      setTimeout(() => setWrong(null), 600); // babalik sa puti pagkatapos ng 0.6s
    }
  }

  function getState(side, id) {
    if (game.isMatched(side, id)) return 'matched';
    if (wrong && wrong[side === 'left' ? 'leftId' : 'rightId'] === id) return 'wrong';
    if (game.selected[side] === id) return 'selected';
    return 'idle';
  }

  function getColor(side, id) {
    const key = side === 'left' ? 'leftId' : 'rightId';
    const index = game.matches.findIndex((m) => m[key] === id);
    return MATCH_COLORS[index] ?? MATCH_COLORS[0];
  }

  return (
    <div ref={container} className="min-h-screen max-w-4xl mx-auto px-4 py-4 sm:py-6 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between gap-2">
        <button
          onClick={game.goToMenu}
          className="bg-white/20 hover:bg-white/30 text-white font-bold px-3 sm:px-4 py-2 rounded-xl transition-colors"
        >
          ⬅ {t.menu}
        </button>

        <div className="flex items-center gap-2">
          <img
            src="/cws-logo.png"
            alt=""
            className="w-9 h-9 sm:w-11 sm:h-11 object-cover [clip-path:circle(49%_at_center)]"
          />
          <span className="hidden sm:block text-white font-black text-xl tracking-wide">MATCH IT RIGHT!</span>
        </div>

        <div className="bg-sky-950/30 text-white font-bold text-xs sm:text-sm px-3 py-2 rounded-xl">
          ❌ {t.mistakes}: {game.mistakes}
        </div>
      </header>

      {/* Round at progress dots */}
      <div className="flex flex-col items-center mt-5">
        <p className="text-white font-extrabold text-lg sm:text-xl">
          {t.round} {game.roundIndex + 1} / {game.totalRounds}
        </p>
        <div className="flex items-center gap-2 mt-2">
          {Array.from({ length: game.totalRounds }).map((_, i) => (
            <span
              key={i}
              className={`h-3 rounded-full transition-all duration-500 ${
                i < game.roundIndex
                  ? 'w-3 bg-emerald-400'
                  : i === game.roundIndex
                  ? 'w-8 bg-amber-400'
                  : 'w-3 bg-white/30'
              }`}
            />
          ))}
        </div>
        <p className="text-white/80 text-xs sm:text-sm text-center mt-3">{t.hint}</p>
      </div>

      {/* Dalawang column */}
      <div ref={columnsRef} className="relative grid grid-cols-2 gap-x-10 sm:gap-x-24 mt-5">
        <h2 className="text-center text-white font-black uppercase tracking-wider mb-3">{t.colA}</h2>
        <h2 className="text-center text-white font-black uppercase tracking-wider mb-3">{t.colB}</h2>

        {/* Hanay A */}
        <div className="flex flex-col gap-3">
          {game.board.left.map((item, index) => (
            <MatchCard
              key={item.id}
              side="left"
              id={item.id}
              label={index + 1}
              text={item.text}
              state={getState('left', item.id)}
              color={getColor('left', item.id)}
              onSelect={handleSelect}
            />
          ))}
        </div>

        {/* Hanay B */}
        <div className="flex flex-col gap-3">
          {game.board.right.map((item, index) => (
            <MatchCard
              key={item.id}
              side="right"
              id={item.id}
              label={LETTERS[index]}
              text={item.text}
              state={getState('right', item.id)}
              color={getColor('right', item.id)}
              onSelect={handleSelect}
            />
          ))}
        </div>

        {/* Mga linya: nakapatong sa dalawang column */}
        <Lines lines={lines} />
      </div>

      {/* Result modal: lalabas kapag tapos ang round o ang buong laro */}
      {(game.status === 'roundDone' || game.status === 'finished') && (
        <ResultModal
          type={game.status === 'finished' ? 'final' : 'round'}
          lang={game.lang}
          round={game.roundIndex + 1}
          mistakes={game.mistakes}
          onNext={game.nextRound}
          onRestart={game.restart}
          onMenu={game.goToMenu}
        />
      )}
    </div>
  );
}