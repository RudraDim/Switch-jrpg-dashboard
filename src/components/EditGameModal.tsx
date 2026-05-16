'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface Game {
  id: number;
  title: string;
  developer: string;
  status: string;
  rating: number;
  image: string;
}

interface EditGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  game: Game;
}

export default function EditGameModal({ isOpen, onClose, game }: EditGameModalProps) {
  const [title, setTitle] = useState(game.title);
  const [developer, setDeveloper] = useState(game.developer || '');
  const [status, setStatus] = useState(game.status);
  const [rating, setRating] = useState(game.rating);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSending, setIsSending] = useState(false);
  const router = useRouter();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    let imageUrl = game.image; // Par défaut, on garde l'ancienne image

    try {
      // 1. Si une nouvelle image est sélectionnée, on l'upload
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

      // 2. Mise à jour (UPDATE) dans la base de données
      const { error } = await supabase
        .from('games')
        .update({
          title,
          developer,
          status,
          rating: Number(rating),
          image: imageUrl,
        })
        .eq('id', game.id); // On cible uniquement le jeu en cours d'édition

      if (error) {
        alert('Erreur lors de la modification : ' + error.message);
      } else {
        router.refresh();
        onClose(); // Ferme la modale après succès
      }
    } catch (err) {
      // On vérifie si l'erreur est une instance de l'objet Error natif
      const errorMessage = err instanceof Error ? err.message : 'Une erreur inconnue est survenue';
      alert('Erreur lors de la mise à jour : ' + errorMessage);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:bg-slate-900">
        <h2 className="mb-4 text-lg font-semibold text-slate-800 dark:text-slate-100">
          Modifier : {game.title}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-slate-400 uppercase">Titre</label>
              <input
                type="text"
                className="rounded-lg border border-slate-300 px-4 py-2 text-slate-900 outline-none focus:ring-2 focus:ring-red-500 dark:bg-slate-800 dark:text-white"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-slate-400 uppercase">Développeur</label>
              <input
                type="text"
                className="rounded-lg border border-slate-300 px-4 py-2 text-slate-900 outline-none focus:ring-2 focus:ring-red-500 dark:bg-slate-800 dark:text-white"
                value={developer}
                onChange={(e) => setDeveloper(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Statut</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 outline-none dark:bg-slate-800 dark:text-white"
              >
                <option value="À faire">À faire</option>
                <option value="En cours">En cours</option>
                <option value="Terminé">Terminé</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-slate-400 uppercase">
                Nouvelle jaquette (laisser vide pour conserver)
              </label>
              <input
                type="file"
                accept="image/*"
                className="w-full rounded-lg border border-slate-200 p-1.5 text-sm text-slate-500 outline-none file:mr-4 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-slate-700 hover:file:bg-slate-200 dark:bg-slate-800"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-400 uppercase">Note globale</label>
              <span className="rounded bg-slate-100 px-2 py-1 text-xs font-bold text-slate-700">
                {rating} / 100
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={rating}
              onChange={(e) => setRating(parseInt(e.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-red-600"
            />
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 transition hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSending}
              className="rounded-lg bg-red-600 px-6 py-2 font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
            >
              {isSending ? 'Enregistrement...' : 'Sauvegarder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
