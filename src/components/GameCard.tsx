'use client';

import { useState } from 'react';
import { deleteGameAction, updateGameAction } from '@/app/actions';
import { supabase } from '@/lib/supabase'; // Ajout de l'import Supabase pour le Storage
import Image from 'next/image';
import Link from 'next/link';

interface Game {
  id: string;
  title: string;
  developer: string;
  rating: number;
  image: string;
  status: string;
}

interface GameCardProps {
  game: Game;
  index: number;
}

export default function GameCard({ game, index }: GameCardProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [title, setTitle] = useState(game.title);
  const [developer, setDeveloper] = useState(game.developer);
  const [status, setStatus] = useState(game.status);
  const [rating, setRating] = useState(game.rating);

  // États ajoutés pour gérer le fichier d'image
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const isPriority = index < 2;

  // Nouvelle fonction pour gérer l'upload et l'action d'édition
  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdating(true);

    const formData = new FormData(e.currentTarget);
    let imageUrl = game.image || ''; // Par défaut, on garde l'ancienne URL

    try {
      // 1. Si un nouveau fichier est sélectionné, on l'envoie sur le Storage
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
        const filePath = `covers/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('images-jeux')
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('images-jeux').getPublicUrl(filePath);

        imageUrl = data.publicUrl;
      }

      // 2. On injecte la bonne URL de l'image (ancienne ou nouvelle) dans le formData
      formData.set('image', imageUrl);

      // 3. On appelle manuellement ta Server Action
      await updateGameAction(formData);

      setIsEditModalOpen(false);
      setImageFile(null); // On clean l'état du fichier
    } catch (err) {
      // On vérifie si l'erreur est une instance de l'objet Error natif
      const errorMessage = err instanceof Error ? err.message : 'Une erreur inconnue est survenue';
      alert('Erreur lors de la mise à jour : ' + errorMessage);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      {/* 1. La div parente hérite du style global de la carte et gère le survol */}
      <div className="group relative flex h-full flex-col rounded-2xl border border-slate-300 bg-white p-5 shadow-sm transition-all hover:translate-y-1.25 hover:shadow-xl">
        {/* BOUTONS D'ACTION (Sortis du Link ! Ils vivent au-dessus grâce au z-30) */}
        <div className="absolute top-4 right-4 z-30 flex gap-2">
          {/* Bouton Éditer ✏️ */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault(); // Sécurité pour Next.js
              e.stopPropagation();
              setIsEditModalOpen(true);
            }}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-slate-100 bg-white text-slate-400 shadow-sm transition-all duration-200 hover:text-blue-600 hover:shadow-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
              />
            </svg>
          </button>

          {/* Bouton Supprimer 🗑️ */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault(); // Sécurité pour Next.js
              e.stopPropagation();
              setIsDeleteModalOpen(true);
            }}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-slate-100 bg-white text-slate-400 shadow-sm transition-all duration-200 hover:text-red-600 hover:shadow-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m14.74 9-.34 12m-4.72 0-.34-12M4.74 9l.34 12A2.25 2.25 0 0 0 7.33 23h9.34a2.25 2.25 0 0 0 2.24-2.05l.34-12M22.84 3.75A21.86 21.86 0 0 1 19.5 4.5M2.16 3.75A21.86 21.86 0 0 0 5.5 4.5m0 0V4.5A2.25 2.25 0 0 1 7.66 2.25h8.68a2.25 2.25 0 0 1 2.24 2.25V4.5M5.5 4.5h13.5"
              />
            </svg>
          </button>
        </div>

        {/* 2. Le Link n'enveloppe plus que le contenu cliquable de la carte */}
        <Link href={`/games/${game.id}`} className="flex h-full flex-col outline-none">
          {/* Contenu de la jaquette */}
          <div className="relative block h-62 w-full shrink-0 overflow-hidden rounded-xl bg-slate-100">
            {game.image ? (
              <Image
                src={game.image}
                alt={`Jaquette de ${game.title}`}
                fill
                priority={isPriority}
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(w-7xl) 25vw, 100vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-slate-300 italic">
                Aucune image
              </div>
            )}
          </div>

          {/* Textes */}
          <div className="grow">
            <h2 className="mt-2 mb-1 line-clamp-2 h-12 text-xl leading-tight font-bold text-slate-800">
              {game.title}
            </h2>
            <p className="text-gray-500">{game.developer}</p>
          </div>

          {/* Status & Barres de stats */}
          <div className="mt-auto pt-4">
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
        </Link>
      </div>

      {/* --- MODAL DE SUPPRESSION --- */}
      {isDeleteModalOpen && (
        <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setIsDeleteModalOpen(false)}
          />
          <div className="relative w-full max-w-md rounded-2xl border border-slate-100 bg-white p-6 text-left shadow-xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-xl text-rose-600">
              ⚠️
            </div>
            <h3 className="text-lg font-bold text-slate-900">Supprimer de la collection ?</h3>
            <p className="mt-2 text-sm text-slate-500">
              Es-tu sûr de vouloir retirer{' '}
              <span className="font-semibold text-slate-800">{game.title}</span> ?
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Annuler
              </button>
              <form action={deleteGameAction} onSubmit={() => setIsDeleteModalOpen(false)}>
                <input type="hidden" name="id" value={game.id} />
                <button
                  type="submit"
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                >
                  Supprimer
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL D'ÉDITION ✏️ --- */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setIsEditModalOpen(false)}
          />

          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl">
            <h3 className="mb-4 text-lg font-bold text-slate-900">Modifier {game.title}</h3>

            {/* Remplacement de action par onSubmit */}
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <input type="hidden" name="id" value={game.id} />

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-400 uppercase">Titre du jeu</label>
                <input
                  type="text"
                  name="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-400 uppercase">
                  Développeur / Éditeur
                </label>
                <input
                  type="text"
                  name="developer"
                  value={developer}
                  onChange={(e) => setDeveloper(e.target.value)}
                  required
                  className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              {/* Remplacement de l'input URL par l'input FILE pour le Storage */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-400 uppercase">
                  Nouvelle jaquette (laisser vide pour conserver)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 outline-none file:mr-4 file:rounded-md file:border-0 file:bg-slate-200 file:px-2 file:py-1 file:text-xs file:font-semibold file:text-slate-700 hover:file:bg-slate-300 focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-400 uppercase">Statut</label>
                <select
                  name="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:bg-white"
                >
                  <option value="À faire">À faire 🗓️</option>
                  <option value="En cours">En cours ⚔️</option>
                  <option value="Terminé">Terminé ✅</option>
                </select>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-400 uppercase">Note globale</label>
                  <span
                    className={`rounded px-2 py-1 text-xs font-bold ${rating >= 80 ? 'bg-green-100 text-green-700' : rating >= 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}
                  >
                    {rating} / 100
                  </span>
                </div>
                <input
                  type="range"
                  name="rating"
                  min="0"
                  max="100"
                  step="1"
                  value={rating}
                  onChange={(e) => setRating(parseInt(e.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-blue-600"
                />
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={() => setIsEditModalOpen(false)}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
                >
                  {isUpdating ? 'Sauvegarde...' : 'Sauvegarder'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
