'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AddGameForm() {
  const [title, setTitle] = useState('');
  const [developer, setDeveloper] = useState('');
  const [status, setStatus] = useState('À faire');
  const [rating, setRating] = useState(50);
  const [imageFile, setImageFile] = useState<File | null>(null); // Changement : on stocke le fichier
  const [isSending, setIsSending] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    let imageUrl = '';

    try {
      // 1. Si un fichier est sélectionné, on l'envoie sur Supabase Storage
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
        const filePath = `covers/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('images-jeux') // Remplace par le nom exact de ton bucket
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        // 2. On récupère son URL publique
        const { data } = supabase.storage.from('images-jeux').getPublicUrl(filePath);

        imageUrl = data.publicUrl;
      }
      // Ajoute ce log juste avant le supabase.from('games').insert(...)
      console.log("L'URL générée est :", imageUrl);
      // 3. Insertion en BDD avec l'URL de l'image (ou vide si pas d'image)
      const { error } = await supabase.from('games').insert([
        {
          title,
          developer,
          status,
          rating: Number(rating),
          // image: 'https://google.com/test.jpg',
          image: imageUrl,
        },
      ]);

      if (error) {
        alert("Erreur lors de l'ajout : " + error.message);
      } else {
        setTitle('');
        setDeveloper('');
        setStatus('À faire');
        setRating(50);
        setImageFile(null); // Reset du fichier
        // On vide l'input file manuellement
        const fileInput = document.getElementById('cover-upload') as HTMLInputElement;
        if (fileInput) fileInput.value = '';

        router.refresh();
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

          {/* Nouveau champ d'upload de fichier */}
          <div>
            <label className="mb-1 block text-xs font-bold text-slate-400 uppercase">
              Jaquette du jeu
            </label>
            <input
              id="cover-upload"
              type="file"
              accept="image/*"
              className="w-full rounded-lg border border-slate-200 p-1.5 text-sm text-slate-500 outline-none file:mr-4 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-slate-700 hover:file:bg-slate-200 focus:ring-2 focus:ring-red-500"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
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
