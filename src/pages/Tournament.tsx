import React, { useEffect, useState } from 'react';
import { Player, Match } from '../types';
import Confetti from 'react-confetti';

export default function Tournament() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedWinner, setSelectedWinner] = useState<{ matchId: string; winnerId: string } | null>(null);
  const [tournamentWinner, setTournamentWinner] = useState<Player | null>(null);

  useEffect(() => {
    const savedMatches = localStorage.getItem('matches');
    const savedTournamentWinner = localStorage.getItem('tournamentWinner');

    if (savedMatches) {
      setMatches(JSON.parse(savedMatches));
    }

    if (savedTournamentWinner) {
      setTournamentWinner(JSON.parse(savedTournamentWinner));
    }

    async function fetchData() {
      try {
        const playersResponse = await fetch('http://localhost:3001/players');
        const playersData = await playersResponse.json();
        setPlayers(playersData);
      } catch (error) {
        console.error('Error fetching players:', error);
      }
    }

    fetchData();
  }, []);

  const initializeTournament = () => {
    if (players.length < 8) {
      alert('É necessário ter pelo menos 8 jogadores para iniciar o torneio.');
      return;
    }

    const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
    const generatedMatches: Match[] = [];

    // Quartas de final
    for (let i = 0; i < shuffledPlayers.length; i += 2) {
      if (shuffledPlayers[i + 1]) {
        generatedMatches.push({
          id: crypto.randomUUID(),
          round: 'quarter-finals',
          player1Id: shuffledPlayers[i].id,
          player2Id: shuffledPlayers[i + 1].id,
          winnerId: null,
        });
      }
    }

    // Semifinais (TBD placeholders)
    for (let i = 0; i < 2; i++) {
      generatedMatches.push({
        id: crypto.randomUUID(),
        round: 'semi-finals',
        player1Id: null,
        player2Id: null,
        winnerId: null,
      });
    }

    // Final (TBD placeholder)
    generatedMatches.push({
      id: crypto.randomUUID(),
      round: 'finals',
      player1Id: null,
      player2Id: null,
      winnerId: null,
    });

    setMatches(generatedMatches);
    setTournamentWinner(null);
    localStorage.removeItem('matches');
    localStorage.removeItem('tournamentWinner');
  };

  const handleSelectWinner = (matchId: string, winnerId: string) => {
    setSelectedWinner({ matchId, winnerId });
  };

  const confirmWinner = () => {
    if (!selectedWinner) return;

    const { matchId, winnerId } = selectedWinner;

    const updatedMatches = matches.map((match) =>
      match.id === matchId ? { ...match, winnerId } : match
    );
    setMatches(updatedMatches);
    localStorage.setItem('matches', JSON.stringify(updatedMatches));
    setSelectedWinner(null);

    const currentMatch = matches.find((match) => match.id === matchId);
    if (currentMatch) {
      const nextMatch = getNextMatch(currentMatch);
      if (nextMatch) {
        updateNextMatch(nextMatch, winnerId);
      } else if (currentMatch.round === 'finals') {
        const winner = players.find((player) => player.id === winnerId);
        setTournamentWinner(winner || null);
        localStorage.setItem('tournamentWinner', JSON.stringify(winner || null));
      }
    }
  };

  const getNextMatch = (currentMatch: Match) => {
    if (currentMatch.round === 'quarter-finals') {
      const quarterFinalToSemiMap = [
        { from: 0, to: 4 }, // Quartas 1 para Semifinal 1
        { from: 1, to: 4 }, // Quartas 2 para Semifinal 1
        { from: 2, to: 5 }, // Quartas 3 para Semifinal 2
        { from: 3, to: 5 }, // Quartas 4 para Semifinal 2
      ];
      const mapping = quarterFinalToSemiMap.find(({ from }) =>
        matches.findIndex((match) => match.id === currentMatch.id) === from
      );
      return mapping ? matches[mapping.to] : null;
    }

    if (currentMatch.round === 'semi-finals') {
      const semiToFinalMap = [
        { from: 4, to: 6 },
        { from: 5, to: 6 },
      ];
      const mapping = semiToFinalMap.find(({ from }) =>
        matches.findIndex((match) => match.id === currentMatch.id) === from
      );
      return mapping ? matches[mapping.to] : null;
    }

    return null;
  };

  const updateNextMatch = (nextMatch: Match, winnerId: string) => {
    const updatedMatch = {
      ...nextMatch,
      player1Id: nextMatch.player1Id ? nextMatch.player1Id : winnerId,
      player2Id: nextMatch.player1Id ? winnerId : nextMatch.player2Id,
    };
    setMatches((prev) => prev.map((match) => (match.id === nextMatch.id ? updatedMatch : match)));
  };

  const getPlayer = (id: string | null) => players.find((player) => player.id === id);

  const resetTournament = () => {
    setMatches([]);
    localStorage.removeItem('matches');
    setSelectedWinner(null);
    setTournamentWinner(null);
    localStorage.removeItem('tournamentWinner');
  };

  const renderWinnerScreen = () => {
    if (!tournamentWinner) return null;

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-800 to-blue-900 text-white relative">
        <Confetti recycle={false} numberOfPieces={500} />
        <h1 className="text-5xl font-extrabold mb-6">🏆 Torneio Finalizado!</h1>
        <div className="text-center flex flex-col items-center">
          <img
            src={tournamentWinner.profileImage || '/placeholder.png'}
            alt={tournamentWinner.username || 'Winner'}
            className="w-32 h-32 rounded-full border-4 border-white mb-4"
          />
          <h2 className="text-3xl font-bold">{tournamentWinner.username}</h2>
          <p className="text-lg mt-2">Parabéns ao grande campeão!</p>
        </div>
        <button
          onClick={resetTournament}
          className="mt-6 px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow hover:bg-gray-200 transition"
        >
          Reiniciar Torneio
        </button>
      </div>
    );
  };

  const renderRound = (round: string) => (
    <div className={`mb-8 ${round === 'finals' ? 'flex justify-center' : ''}`}>
      {round !== 'finals' && <h2 className="text-center text-2xl font-bold capitalize mb-6 text-blue-700">{round.replace('-', ' ')}</h2>}
      <div className={`${round === 'finals' ? 'flex justify-center' : 'grid grid-cols-1 md:grid-cols-2'} gap-6`}>
        {matches
          .filter((match) => match.round === round)
          .map((match) => (
            <div
              key={match.id}
              className="p-6 rounded-lg shadow-lg hover:shadow-2xl transition border border-gray-700"
            >
              <div className="flex justify-between items-center mb-6">
                <div
                  onClick={() => match.player1Id && handleSelectWinner(match.id, match.player1Id)}
                  className={`flex items-center space-x-4 cursor-pointer p-3 rounded-lg hover:bg-gray-500 transition ${
                    selectedWinner?.matchId === match.id && selectedWinner?.winnerId === match.player1Id
                      ? 'bg-gray-500 text-white'
                      : 'bg-transparent'
                  }`}
                >
                  <img
                    src={getPlayer(match.player1Id)?.profileImage || '/placeholder.png'}
                    alt={getPlayer(match.player1Id)?.username || 'TBD'}
                    className="w-20 h-20 rounded-full border-2 border-gray-700"
                  />
                  <span className="text-lg font-semibold text-gray-300 rounded-md p-2">{getPlayer(match.player1Id)?.username || 'TBD'}</span>
                </div>

                <span className="text-gray-400 text-lg font-bold">vs</span>

                <div
                  onClick={() => match.player2Id && handleSelectWinner(match.id, match.player2Id)}
                  className={`flex items-center space-x-4 cursor-pointer p-3 rounded-lg hover:bg-gray-500 transition ${
                    selectedWinner?.matchId === match.id && selectedWinner?.winnerId === match.player2Id
                      ? 'bg-gray-500 text-white'
                      : 'bg-transparent'
                  }`}
                >
                  <img
                    src={getPlayer(match.player2Id)?.profileImage || '/placeholder.png'}
                    alt={getPlayer(match.player2Id)?.username || 'TBD'}
                    className="w-20 h-20 rounded-full border-2 border-gray-700"
                  />
                  <span className="text-lg font-semibold text-gray-300 rounded-md p-2">{getPlayer(match.player2Id)?.username || 'TBD'}</span>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );

  return (
    <div className="bg-gray-900 text-white p-10 rounded-3xl shadow-2xl space-y-12">
      {tournamentWinner ? (
        renderWinnerScreen()
      ) : (
        <>
          <h1 className="text-center text-4xl font-extrabold tracking-wide text-blue-400">Torneio de Jogadores</h1>
          <button
            onClick={initializeTournament}
            className="block mx-auto bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition shadow-lg hover:shadow-xl"
          >
            Iniciar Torneio
          </button>

          {['quarter-finals', 'semi-finals', 'finals'].map(renderRound)}

          <button
            onClick={confirmWinner}
            className="block mx-auto bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition shadow-lg hover:shadow-xl mt-8"
          >
            Confirmar Vitória
          </button>

          <button
            onClick={resetTournament}
            className="mt-10 bg-gray-600 px-6 py-3 rounded-full hover:bg-gray-700 text-white transition shadow-lg hover:shadow-xl mx-auto block"
          >
            Reiniciar Torneio
          </button>
        </>
      )}
    </div>
  );
}
