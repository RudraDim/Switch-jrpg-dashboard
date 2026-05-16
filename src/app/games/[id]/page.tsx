import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface GamePageProps {
  params: Promise<{ id: string }>;
}

export default async function GameDetailPage({ params }: GamePageProps) {
  // 1. Piège Next.js 15 : On attend la résolution des paramètres de route
  const resolvedParams = await params;
  const gameId = resolvedParams.id;

  // 2. Fetch du jeu spécifique dans Supabase
  const { data: game, error } = await supabase.from('games').select('*').eq('id', gameId).single(); // On veut un seul objet, pas un tableau

  // Si le jeu n'existe pas ou qu'il y a une erreur, on renvoie une page 404
  if (error || !game) {
    notFound();
  }

  return (
    <main className="mx-auto min-h-screen max-w-4xl bg-slate-50 p-8">
      {/* Bouton Retour */}
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-800"
      >
        ← Retour au Dashboard
      </Link>

      <div className="flex flex-col gap-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row">
        {/* Section Jaquette */}
        <div className="relative h-96 w-full shrink-0 overflow-hidden rounded-2xl bg-slate-100 shadow-sm md:w-64">
          {game.image ? (
            <Image
              src={game.image}
              alt={`Jaquette de ${game.title}`}
              fill
              priority
              className="object-cover"
              sizes="(max-w-4xl) 33vw, 100vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-slate-300 italic">
              Aucune image disponible
            </div>
          )}
        </div>

        {/* Section Infos */}
        <div className="flex grow flex-col justify-between py-2">
          <div>
            <span
              className={`mb-3 inline-block rounded px-2.5 py-1 text-xs font-semibold ${
                game.status === 'En cours'
                  ? 'bg-blue-100 text-blue-700'
                  : game.status === 'Terminé'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-slate-100 text-slate-600'
              }`}
            >
              {game.status}
            </span>

            <h1 className="text-3xl leading-tight font-black tracking-tight text-slate-900">
              {game.title}
            </h1>
            <p className="mt-1 text-lg text-slate-500">Développé par {game.developer}</p>
          </div>

          {/* Bloc Note */}
          <div className="mt-6 border-t border-slate-100 pt-6">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-bold tracking-wider text-slate-400 uppercase">
                Note de la review
              </span>
              <span className="text-2xl font-black text-slate-800">
                {game.rating}
                <span className="text-sm font-medium text-slate-400">/100</span>
              </span>
            </div>

            <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full transition-all duration-500 ${
                  game.rating >= 80
                    ? 'bg-emerald-500'
                    : game.rating >= 50
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                }`}
                style={{ width: `${game.rating}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
