import { supabase } from '@/lib/supabase';
import AddGameForm from '@/components/AddGameForm'
import GameCard from '@/components/GameCard'

export default async function Home() {
  const { data: games, error } = await supabase
  .from('games')
  .select('*')
  .order('id', { ascending: true });
  
  if (error) return <div>Erreur</div>;
  
  return (
    <main className="p-8">

    <AddGameForm />
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {games?.map((game) => (
    <GameCard key={game.id} game={game} />
  ))}
  </div>

    </main>
  );
}