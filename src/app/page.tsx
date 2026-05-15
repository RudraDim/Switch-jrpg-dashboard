import { supabase } from '@/lib/supabase';
import AddGameForm from '@/components/AddGameForm';
import { deleteGameAction } from './actions';
import Image from 'next/image'

export default async function Home() {
  const { data: games, error } = await supabase
  .from('games')
  .select('*')
  .order('id', { ascending: true });
  
  if (error) return <div>Erreur</div>;
  
  return (
    <main className="p-8">
    {/* ... header ... */}
    <AddGameForm />
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {games?.map((game) => (
      <div 
  key={game.id} 
  className="relative group border border-slate-100 p-5 rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-transparent"
>
      
      {/* On branche l'action importée */}
      <form action={deleteGameAction} className="absolute top-4 right-4">
      <input type="hidden" name="id" value={game.id} /> 
      <button type="submit" className="group-hover:opacity-100 text-slate-300 hover:text-red-500">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
      </button>
      </form>
      <div className="relative w-full aspect-cover overflow-hidden rounded-xl bg-slate-100 group">
  {game.image ? (
    <Image 
      src={game.image} 
      alt={game.title}
      fill // <--- Très important : l'image va remplir le conteneur parent
      className="object-cover transition-transform duration-500 group-hover:scale-110"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  ) : (
    <div className="flex items-center justify-center h-full text-slate-300 italic text-xs">
      Aucune image
    </div>
  )}
</div>
      <h2 className="text-xl font-bold">{game.title}</h2>
      <p className="text-gray-500">{game.developer}</p>
      
      <div className="mt-4 flex justify-between items-center">
      <span className={`px-2 py-1 rounded text-xs ${
        game.status === 'En cours' ? 'bg-blue-100 text-blue-700' : 
        game.status === 'Terminé' ? 'bg-green-100 text-green-700' : 'bg-gray-100'
      }`}>
      {game.status}
      </span>
      <div className="mt-3">
  {/* Chiffre et Label */}
  <div className="flex justify-between items-end mb-1">
    <span className="text-sm font-bold text-slate-700">{game.rating}/100</span>
  </div>

  {/* Conteneur de la barre (le "slot") */}
  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
    {/* La jauge (le remplissage) */}
    <div 
      className={`h-full transition-all duration-1000 ease-out ${
        game.rating >= 80 ? 'bg-emerald-500' : 
        game.rating >= 50 ? 'bg-amber-400' : 
        'bg-rose-500'
      }`}
      style={{ width: `${game.rating}%` }}
    />
  </div>
</div>
      </div>
      </div>
    ))}
    </div>
    </main>
  );
}