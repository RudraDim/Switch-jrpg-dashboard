'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function AddGameForm() {
  const [title, setTitle] = useState('')
  const [developer, setDeveloper] = useState('')
  const [status, setStatus] = useState('À faire')
  const [rating, setRating] = useState(50)
  const [image, setImage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const router = useRouter()
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSending(true)
    const { error } = await supabase
    .from('games')
    .insert([{ 
      title, 
      developer, 
      status, 
      rating: Number(rating),
      image 
    }])
    
    if (error) {
      alert("Erreur lors de l'ajout : " + error.message)
    } else {
      setTitle('')
      setDeveloper('')
      setStatus('À faire')
      setRating(50)
      setImage('')
      router.refresh()
    }
    setIsSending(false)
  }
  
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-10">
    <h2 className="text-lg font-semibold mb-4 text-slate-800">Ajouter un nouveau JRPG</h2>
    
    <form onSubmit={handleSubmit} className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {/* Titre */}
    <input 
    type="text" 
    placeholder="Titre du jeu (ex: Final Fantasy...)" 
    className="px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 text-slate-900 outline-none"
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    required
    />
    
    {/* Développeur */}
    <input 
    type="text" 
    placeholder="Développeur (ex: Square Enix)" 
    className="px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 text-slate-900 outline-none"
    value={developer}
    onChange={(e) => setDeveloper(e.target.value)}
    />
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
    {/* Statut */}
    <div className="flex flex-col gap-1">
    <label className="text-xs font-bold text-slate-500 uppercase">Statut</label>
    <select 
    value={status}
    onChange={(e) => setStatus(e.target.value)}
    className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 outline-none"
    >
    <option value="À faire">À faire</option>
    <option value="En cours">En cours</option>
    <option value="Terminé">Terminé</option>
    </select>
    </div>
    
    <div>
    <label className="block text-xs font-bold uppercase text-slate-400 mb-1">URL de la jaquette</label>
    <input 
    type="url" 
    name="image" 
    placeholder="https://example.com/image.jpg"
    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900"
    value={image} // <--- On lie la valeur
    onChange={(e) => setImage(e.target.value)} // <--- On met à jour l'état
  />
    </div>
    
    {/* Bouton Submit */}
    <button 
    type="submit" 
    disabled={isSending}
    className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50 h-42px"
    >
    {isSending ? 'Ajout...' : 'Ajouter le jeu'}
    </button>
    </div>
    
    {/* Rating Slider */}
<div className="flex flex-col gap-4 pt-2">
  <div className="flex justify-between items-center">
    <label className="text-xs font-bold uppercase text-slate-400">Note globale</label>
    {/* Petit badge qui affiche la note en temps réel */}
    <span className={`px-2 py-1 rounded text-xs font-bold ${
      rating >= 80 ? 'bg-green-100 text-green-700' : 
      rating >= 50 ? 'bg-yellow-100 text-yellow-700' : 
      'bg-red-100 text-red-700'
    }`}>
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
    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
  />
  
  <div className="flex justify-between text-[10px] text-slate-400 font-medium px-1">
    <span>NAVET</span>
    <span>MOYEN</span>
    <span>CHEF D&rsquo;ŒUVRE</span>
  </div>
</div>
    </form>
    </div>
  )
}