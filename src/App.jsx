import TitleScreen from './components/TitleScreen';
import MatchBoard from './components/MatchBoard';
import { useMatchGame } from './hooks/useMatchGame';

export default function App() {
  const game = useMatchGame();

  if (game.status === 'idle') {
    return <TitleScreen onStart={game.startGame} />;
  }

  return <MatchBoard game={game} />;
}