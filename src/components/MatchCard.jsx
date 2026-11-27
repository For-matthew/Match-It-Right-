export default function MatchCard({ side, id, label, text, state, color, onSelect }) {
  const isLeft = side === 'left';

  // Itsura ng card depende sa estado nito
  const looks = {
    idle: 'bg-white text-sky-950 border-sky-200 hover:bg-sky-50',
    selected: 'bg-amber-300 text-sky-950 border-amber-500 ring-4 ring-white/80',
    wrong: 'bg-rose-500 text-white border-rose-700',
    matched: color.card,
  };

  const badgeLook = state === 'idle' ? 'bg-sky-500 text-white' : 'bg-white/30';

  return (
    <button
      type="button"
      data-card={`${side}-${id}`}
      onClick={() => onSelect(side, id)}
      disabled={state === 'matched'}
      className={`card-${side} relative w-full min-h-14 flex items-center gap-1.5 sm:gap-3 rounded-2xl border-b-4 px-2 sm:px-4 py-2.5 sm:py-3 text-left font-bold text-xs sm:text-base leading-snug shadow-lg cursor-pointer disabled:cursor-default transition-colors ${looks[state]}`}
    >
      {/* 1. Numero (1–4) o letra (A–D) */}
      <span
        className={`shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-black text-xs sm:text-sm transition-colors ${badgeLook}`}
      >
        {label}
      </span>

      {/* 2. Ang text ng card: min-w-0 + wrap-anywhere para hindi lumampas ang mahabang salita */}
      <span className="flex-1 min-w-0 wrap-anywhere">{text}</span>

      {/* 3. Tuldok: dito kakabit ang linya */}
      <span
        data-dot={`${side}-${id}`}
        style={{ backgroundColor: state === 'matched' ? color.hex : undefined }}
        className={`absolute top-1/2 -translate-y-1/2 ${isLeft ? '-right-2' : '-left-2'} w-4 h-4 rounded-full border-[3px] border-white bg-sky-500 shadow`}
      />
    </button>
  );
}