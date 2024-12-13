import React, { useEffect, useState } from 'react';
import { Player } from '../types'; // Certifique-se de que a tipagem está no caminho correto.

export default function UserControl() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);
  const [editedName, setEditedName] = useState<string>('');

  useEffect(() => {
    async function fetchPlayers() {
      try {
        const response = await fetch('http://localhost:3001/players'); // Certifique-se de que a URL está correta.
        const data = await response.json();
        setPlayers(data);
      } catch (error) {
        console.error('Erro ao buscar jogadores:', error);
      }
    }
    fetchPlayers();
  }, []);

  const handleDeletePlayer = async (playerId: string) => {
    try {
      await fetch(`http://localhost:3001/players/${playerId}`, {
        method: 'DELETE',
      });
      setPlayers((prevPlayers) => prevPlayers.filter((player) => player.id !== playerId));
    } catch (error) {
      console.error('Erro ao excluir jogador:', error);
    }
  };

  const handleEditPlayer = (playerId: string, currentName: string) => {
    setEditingPlayerId(playerId);
    setEditedName(currentName);
  };

  const handleSavePlayer = async (playerId: string) => {
    try {
      await fetch(`http://localhost:3001/players/${playerId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: editedName }),
      });
      setPlayers((prevPlayers) =>
        prevPlayers.map((player) =>
          player.id === playerId ? { ...player, username: editedName } : player
        )
      );
      setEditingPlayerId(null);
      setEditedName('');
    } catch (error) {
      console.error('Erro ao salvar jogador:', error);
    }
  };

  return (
    <div className="bg-gray-900 text-white p-10 rounded-3xl shadow-2xl space-y-12">
      <h1 className="text-center text-4xl font-extrabold tracking-wide text-blue-400">
        Controle de Usuários
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {players.map((player) => (
          <div
            key={player.id}
            className="p-6 bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <img
                  src={player.profileImage || '/placeholder.png'}
                  alt={player.username}
                  className="w-16 h-16 rounded-full border-2 border-gray-700"
                />
                {editingPlayerId === player.id ? (
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="px-2 py-1 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <span className="text-lg font-semibold">{player.username}</span>
                )}
              </div>
              <div className="flex space-x-2">
                {editingPlayerId === player.id ? (
                  <button
                    onClick={() => handleSavePlayer(player.id)}
                    className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                  >
                    Salvar
                  </button>
                ) : (
                  <button
                    onClick={() => handleEditPlayer(player.id, player.username)}
                    className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition"
                  >
                    Editar
                  </button>
                )}
                <button
                  onClick={() => handleDeletePlayer(player.id)}
                  className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
