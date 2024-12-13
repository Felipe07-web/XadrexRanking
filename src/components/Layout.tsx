import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { FaChessBoard, FaTrophy, FaUserPlus, FaUsers, FaUserCog } from 'react-icons/fa'; // Importa o ícone para o controle de usuários

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <FaChessBoard className="h-8 w-8 text-blue-500" />
              <span className="text-xl font-bold">Ranking Vila Nova</span>
            </Link>
            <div className="flex space-x-4">
              <Link to="/" className="flex items-center space-x-1 hover:text-blue-400">
                <FaTrophy className="h-5 w-5" />
                <span>Ranking</span>
              </Link>
              <Link to="/tournament" className="flex items-center space-x-1 hover:text-blue-400">
                <FaUsers className="h-5 w-5" />
                <span>Tourneio</span>
              </Link>
              <Link to="/register" className="flex items-center space-x-1 hover:text-blue-400">
                <FaUserPlus className="h-5 w-5" />
                <span>Registrar</span>
              </Link>
              <Link to="/user-control" className="flex items-center space-x-1 hover:text-blue-400">
                <FaUserCog className="h-5 w-5" />
                <span>Controle de Usuários</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
