'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AddGameForm() {
  const [title, setTitle] = useState('');
  const [developer, setDeveloper] = useState('');
  const [status, setStatus] = useState('À faire');
  const [rating, setRating] = useState(50);
  const [image, setImage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    const { error } = await supabase.from('games').insert([
      {
        title,
        developer,
        status,
        rating: Number(rating),
        image,
      },
    ]);

    if (error) {
      alert("Erreur lors de l'ajout : " + error.message);
    } else {
      setTitle('');
      setDeveloper('');
      setStatus('À faire');
      setRating(50);
      setImage('');
      router.refresh();
    }
    setIsSending(false);
  };

  return (
    <div className="mb-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-slate-800">Ajouter un nouveau JRPG</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <input
            type="text"
            placeholder="Titre du jeu (ex: Final Fantasy...)"
            className="rounded-lg border border-slate-300 px-4 py-2 text-slate-900 outline-none focus:ring-2 focus:ring-red-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Développeur (ex: Square Enix)"
            className="rounded-lg border border-slate-300 px-4 py-2 text-slate-900 outline-none focus:ring-2 focus:ring-red-500"
            value={developer}
            onChange={(e) => setDeveloper(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Statut</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 outline-none"
            >
              <option value="À faire">À faire</option>
              <option value="En cours">En cours</option>
              <option value="Terminé">Terminé</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-slate-400 uppercase">
              URL de la jaquette
            </label>
            <input
              type="url"
              name="image"
              placeholder="https://example.com/image.jpg"
              className="w-full rounded-lg border border-slate-200 p-2 text-slate-900 outline-none focus:ring-2 focus:ring-red-500"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={isSending}
            className="h-42px rounded-lg bg-red-600 px-6 py-2 font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
          >
            {isSending ? 'Ajout...' : 'Ajouter le jeu'}
          </button>
        </div>

        <div className="flex flex-col gap-4 pt-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-400 uppercase">Note globale</label>
            <span
              className={`rounded px-2 py-1 text-xs font-bold ${
                rating >= 80
                  ? 'bg-green-100 text-green-700'
                  : rating >= 50
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
              }`}
            >
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

          <div className="flex justify-between px-1 text-[10px] font-medium text-slate-400">
            <span>NAVET</span>
            <span>MOYEN</span>
            <span>CHEF D&rsquo;ŒUVRE</span>
          </div>
        </div>
      </form>
    </div>
  );
}
