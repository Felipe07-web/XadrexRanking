export interface Player {
  id: string;
  username: string;
  profileImage: string;
  points: number;
  rank: number;
}

export interface Match {
  id: string;
  player1Id: string;
  player2Id: string;
  winnerId?: string;
  isDraw: boolean;
  tournamentId: string;
  round: string;
}

export interface Tournament {
  id: string;
  status: 'upcoming' | 'in-progress' | 'completed';
  currentRound: string;
  matches: string[];
}