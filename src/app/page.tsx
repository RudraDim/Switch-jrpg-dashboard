import { supabase } from '@/lib/supabase';
import AddGameForm from '@/components/AddGameForm';
import GameCard from '@/components/GameCard';
import StatsDashboard from '@/components/StatsDashboard';
import FilterControls from '@/components/FilterControls';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Home({ searchParams }: PageProps) {
  // 1. On attend la résolution des paramètres de l'URL
  const resolvedSearchParams = await searchParams;
  const statusFilter = (resolvedSearchParams?.status as string) || 'Tout';
  const sortFilter = (resolvedSearchParams?.sort as string) || 'rating_desc';

  // 2. UN SEUL FETCH PROPRE : On récupère tous les jeux de Supabase
  const { data: gamesList, error } = await supabase
    .from('games')
    .select('*')
    .order('id', { ascending: true });

  if (error)
    return <div className="p-8 font-bold text-red-600">Erreur lors du chargement des données.</div>;

  const allGames = gamesList || [];

  // 3. Application du FILTRE
  let filteredGames = [...allGames];
  if (statusFilter !== 'Tout') {
    filteredGames = filteredGames.filter((game) => game.status === statusFilter);
  }

  // 4. Application du TRI (Un seul bloc suffit !)
  filteredGames.sort((a, b) => {
    if (sortFilter === 'rating_desc') return b.rating - a.rating;
    if (sortFilter === 'rating_asc') return a.rating - b.rating;
    if (sortFilter === 'title_asc') return a.title.localeCompare(b.title);
    if (sortFilter === 'title_desc') return b.title.localeCompare(a.title);
    return 0;
  });

  return (
    <main className="mx-auto min-h-screen max-w-7xl bg-slate-50 p-8">
      <h1 className="mb-6 text-3xl font-black tracking-tight text-slate-800">
        Ma collection de JRPG
      </h1>

      {/* On passe tous les jeux aux stats pour garder une vue d'ensemble globale */}
      <StatsDashboard games={allGames} />

      <AddGameForm />

      <FilterControls />

      {/* 5. UNE SEULE GRILLE CSS PROPRE ICI */}
      {filteredGames.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          {filteredGames.map((game, index) => (
            // On passe l'index à GameCard pour gérer correctement le priority
            <GameCard key={game.id} game={game} index={index} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-400">
          Aucun JRPG ne correspond à ce filtre.
        </div>
      )}
    </main>
  );
}
