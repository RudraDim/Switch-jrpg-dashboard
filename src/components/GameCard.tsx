'use client';

import { deleteGameAction } from '@/app/actions';
import Image from 'next/image';

interface Game {
  id: string;
  title: string;
  developer: string;
  rating: number;
  image: string;
  status: string;
}

export default function GameCard({ game }: { game: Game }) {
  return (
    <div className="group relative flex h-full flex-col rounded-2xl border border-slate-300 bg-white p-5 shadow-sm transition-all hover:translate-y-1.25 hover:shadow-xl">
      {/* Formulaire de suppression */}
      <form
        action={deleteGameAction}
        onSubmit={(e) => {
          if (!confirm('Es-tu sûr de vouloir supprimer ce jeu de ta collection ?')) {
            e.preventDefault(); // Annule l'envoi du formulaire si l'utilisateur clique sur "Annuler"
          }
        }}
        className="absolute top-4 right-4 z-20"
      >
        <input type="hidden" name="id" value={game.id} />
        <button
          type="submit"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-100 bg-white text-slate-400 shadow-sm transition-all duration-200 hover:text-red-500 hover:shadow-md"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
          </svg>
        </button>
      </form>
      <div className="aspect-cover group relative w-full overflow-hidden rounded-xl bg-slate-100">
        {game.image ? (
          <Image
            src={game.image}
            alt={game.title}
            fill // <--- Très important : l'image va remplir le conteneur parent
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-slate-300 italic">
            Aucune image
          </div>
        )}
      </div>
      <div className="grow">
        <h2 className="mt-2 mb-1 line-clamp-2 h-12 text-xl leading-tight font-bold">
          {game.title}
        </h2>
        <p className="text-gray-500">{game.developer}</p>
      </div>
      <div className="mt-auto pt-4">
        {/* Ligne du haut : Status et Score alignés */}
        <div className="mb-2 flex items-center justify-between">
          <span
            className={`rounded px-2 py-1 text-xs font-medium ${
              game.status === 'En cours'
                ? 'bg-blue-100 text-blue-700'
                : game.status === 'Terminé'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-600'
            }`}
          >
            {game.status}
          </span>

          <span className="text-sm font-bold text-slate-700">
            {game.rating}
            <span className="text-xs text-slate-400">/100</span>
          </span>
        </div>

        {/* Ligne du bas : La barre de progression seule */}
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full transition-all duration-700 ${
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
  );
}
