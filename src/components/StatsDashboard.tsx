'use client';

interface Game {
  id: string;
  title: string;
  developer: string;
  rating: number;
  image: string;
  status: string;
}

interface StatsDashboardProps {
  games: Game[];
}

export default function StatsDashboard({ games = [] }: StatsDashboardProps) {
  const totalGames = games.length;

  // Calcul de la moyenne globale
  const averageRating =
    totalGames > 0
      ? Math.round(games.reduce((acc, game) => acc + (game.rating || 0), 0) / totalGames)
      : 0;

  // Calcul du taux de complétion (Jeux ayant le statut 'Terminé')
  const completedGames = games.filter((game) => game.status === 'Terminé').length;
  const completionRate = totalGames > 0 ? Math.round((completedGames / totalGames) * 100) : 0;

  return (
    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
      {/* Carte : Total JRPG */}
      <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-2xl shadow-inner">
          🎮
        </div>
        <div>
          <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase">Total JRPG</h3>
          <p className="text-2xl font-bold text-slate-800">{totalGames}</p>
        </div>
      </div>

      {/* Carte : Moyenne Globale */}
      <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-2xl shadow-inner">
          🏆
        </div>
        <div>
          <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase">
            Moyenne Globale
          </h3>
          <p className="text-2xl font-bold text-slate-800">
            {averageRating}
            <span className="text-sm font-medium text-slate-400">/100</span>
          </p>
        </div>
      </div>

      {/* Carte : Taux de Complétion */}
      <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-2xl shadow-inner">
          ✅
        </div>
        <div>
          <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase">Complétion</h3>
          <p className="text-2xl font-bold text-slate-800">
            {completionRate}
            <span className="text-sm font-medium text-slate-400">%</span>
          </p>
        </div>
      </div>
    </div>
  );
}
