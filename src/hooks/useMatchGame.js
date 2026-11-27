import { useState } from 'react';
import { getPairs } from '../data/pairs';

const ROUND_SIZE = 4; // ilang pares bawat round

// Fisher-Yates shuffle: ginugulo ang pagkakasunod-sunod nang patas.
// Gumagawa ng kopya ([...array]) para hindi magalaw ang original.
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Hinahati ang array sa mga grupo. Hal: 12 items, size 4 → [[4], [4], [4]]
function chunk(array, size) {
  const groups = [];
  for (let i = 0; i < array.length; i += size) {
    groups.push(array.slice(i, i + size));
  }
  return groups;
}

// Inihahanda ang dalawang column ng isang round.
// Magkahiwalay ang shuffle ng kaliwa at kanan para hindi magkatapat ang sagot.
function buildBoard(roundPairs) {
  return {
    left: shuffle(roundPairs.map((p) => ({ id: p.id, text: p.left, answer: p.right }))),
    right: shuffle(roundPairs.map((p) => ({ id: p.id, text: p.right }))),
  };
}

export function useMatchGame() {
  const [lang, setLang] = useState('tl');
  const [rounds, setRounds] = useState([]);          // lahat ng rounds
  const [roundIndex, setRoundIndex] = useState(0);   // kasalukuyang round (0, 1, 2)
  const [board, setBoard] = useState({ left: [], right: [] });
  const [selected, setSelected] = useState({ left: null, right: null });
  const [matches, setMatches] = useState([]);        // [{ leftId, rightId }]
  const [mistakes, setMistakes] = useState(0);
  const [status, setStatus] = useState('idle');      // idle | playing | roundDone | finished

  // Para mabilis malaman kung naka-match na ang isang card
  const matchedLeft = new Set(matches.map((m) => m.leftId));
  const matchedRight = new Set(matches.map((m) => m.rightId));

  function isMatched(side, id) {
    return side === 'left' ? matchedLeft.has(id) : matchedRight.has(id);
  }

  function startGame(newLang) {
    const allRounds = chunk(shuffle(getPairs(newLang)), ROUND_SIZE);

    setLang(newLang);
    setRounds(allRounds);
    setRoundIndex(0);
    setBoard(buildBoard(allRounds[0]));
    setSelected({ left: null, right: null });
    setMatches([]);
    setMistakes(0);
    setStatus('playing');
  }

  function select(side, id) {
    if (status !== 'playing') return null;
    if (isMatched(side, id)) return null; // naka-lock na ang tamang sagot

    // I-tap ulit ang napili = bawiin ang pagpili
    const next = { ...selected, [side]: selected[side] === id ? null : id };

    // Kulang pa: isang side pa lang ang may napili
    if (next.left === null || next.right === null) {
      setSelected(next);
      return { type: 'selected' };
    }

    // May napili na sa magkabilang side, kaya i-check
    const leftItem = board.left.find((i) => i.id === next.left);
    const rightItem = board.right.find((i) => i.id === next.right);
    const isCorrect = leftItem.answer === rightItem.text; // text ang ikinukumpara

    setSelected({ left: null, right: null });
    const result = { leftId: next.left, rightId: next.right };

    if (isCorrect) {
      const newMatches = [...matches, result];
      setMatches(newMatches);

      // Tapos na ba ang round?
      if (newMatches.length === board.left.length) {
        const isLastRound = roundIndex === rounds.length - 1;
        setStatus(isLastRound ? 'finished' : 'roundDone');
      }
      return { type: 'correct', ...result };
    }

    setMistakes((m) => m + 1);
    return { type: 'wrong', ...result };
  }

  function nextRound() {
    const n = roundIndex + 1;
    setRoundIndex(n);
    setBoard(buildBoard(rounds[n]));
    setSelected({ left: null, right: null });
    setMatches([]);
    setStatus('playing');
  }

  function restart() {
    startGame(lang);
  }

  return {
    lang,
    status,
    roundIndex,
    totalRounds: rounds.length,
    board,
    selected,
    matches,
    mistakes,
    isMatched,
    startGame,
    select,
    nextRound,
    restart,
    goToMenu,
    
  
  };
    function goToMenu() {
    setStatus('idle');
    
  }
}