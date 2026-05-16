'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export default function FilterControls() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // On récupère les valeurs actuelles de l'URL ou on met des valeurs par défaut
  const currentStatus = searchParams.get('status') || 'Tout';
  const currentSort = searchParams.get('sort') || 'rating_desc';

  // Fonction pour mettre à jour un paramètre dans l'URL sans écraser les autres
  const updateParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'Tout' && key === 'status') {
      params.delete(key); // On nettoie l'URL si on clique sur "Tout"
    } else {
      params.set(key, value);
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const statuses = ['Tout', 'À faire', 'En cours', 'Terminé'];

  return (
    <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      {/* Filtres par statut (Boutons / Onglets) */}
      <div className="flex flex-wrap gap-2">
        {statuses.map((status) => (
          <button
            key={status}
            onClick={() => updateParams('status', status)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              currentStatus === status
                ? 'bg-red-600 text-white shadow-sm'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Menu déroulant pour le Tri */}
      <div className="flex items-center gap-2">
        <label htmlFor="sort" className="text-xs font-bold tracking-wider text-slate-400 uppercase">
          Trier par
        </label>
        <select
          id="sort"
          value={currentSort}
          onChange={(e) => updateParams('sort', e.target.value)}
          className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition outline-none focus:border-red-500 focus:bg-white"
        >
          <option value="rating_desc">Meilleures notes 🏆</option>
          <option value="rating_asc">Moins bonnes notes 📉</option>
          <option value="title_asc">Titre (A-Z) 🔤</option>
          <option value="title_desc">Titre (Z-A) 🔤</option>
        </select>
      </div>
    </div>
  );
}
