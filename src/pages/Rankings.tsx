import React, { useEffect, useState } from "react";
import { Trophy, Medal } from "lucide-react";
import { Player } from "../types";

export default function Rankings() {
  const [players, setPlayers] = useState<Player[]>([]);

  const fetchPlayers = async () => {
    const res = await fetch("http://localhost:3001/players");
    const data = await res.json();

    // Ordenar os jogadores pelo ranking (pontos)
    const sortedPlayers = data.sort((a: Player, b: Player) => b.points - a.points);
    setPlayers(sortedPlayers);
  };

  const updatePlayerPoints = async (playerId: string, newPoints: number) => {
    try {
      // Atualizar no backend
      await fetch(`http://localhost:3001/players/${playerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ points: newPoints }),
      });

      // Atualizar no frontend e reordenar a lista
      setPlayers((prevPlayers) =>
        [...prevPlayers]
          .map((player) =>
            player.id === playerId ? { ...player, points: newPoints } : player
          )
          .sort((a, b) => b.points - a.points)
      );
    } catch (error) {
      console.error("Erro ao atualizar os pontos:", error);
    }
  };

  const handleAddPoint = (playerId: string, increment: number) => {
    const player = players.find((p) => p.id === playerId);
    if (!player) return;

    const newPoints = player.points + increment;
    updatePlayerPoints(playerId, newPoints);
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  return (
    <div className="space-y-8 bg-gray-900 min-h-screen py-8 px-4">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-5xl font-extrabold text-white-400 mb-4">Chess Masters Rankings</h1>
        <p className="text-gray-300">Veja o ranking atualizado de todos os jogadores</p>
      </div>

      {/* Rankings List */}
      <div className="bg-gray-800 rounded-lg shadow-2xl p-8">
        <div className="grid grid-cols-1 gap-6">
          {players.map((player, index) => (
            <div
              key={player.id}
              className="flex items-center space-x-6 p-6 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
            >
              {/* Rank Indicators */}
              <div className="flex-shrink-0">
                {index === 0 && <Trophy className="h-10 w-10 text-yellow-400" />}
                {index === 1 && <Medal className="h-10 w-10 text-gray-300" />}
                {index === 2 && <Medal className="h-10 w-10 text-amber-600" />}
                {index > 2 && (
                  <span className="text-3xl font-bold text-gray-400">{index + 1}</span>
                )}
              </div>

              {/* Player Info */}
              <div className="flex-shrink-0">
                <img
                  src={player.profileImage || "/placeholder.png"}
                  alt={player.username}
                  className="h-16 w-16 rounded-full object-cover border-4 border-white-500"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-white">{player.username}</h3>
                <p className="text-lg text-gray-400">Pontos: {player.points.toFixed(1)}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleAddPoint(player.id, 1)}
                  className="px-4 py-2 bg-gray-500 text-white font-bold rounded-lg shadow-md hover:bg-green-600 transition"
                >
                  +1
                </button>
                <button
                  onClick={() => handleAddPoint(player.id, 0.5)}
                  className="px-4 py-2 bg-gray-500 text-white font-bold rounded-lg shadow-md hover:bg-blue-600 transition"
                >
                  +0.5
                </button>
                <button
                  onClick={() => handleAddPoint(player.id, -1)}
                  className="px-4 py-2 bg-gray-500 text-white font-bold rounded-lg shadow-md hover:bg-red-600 transition"
                >
                  -1
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
