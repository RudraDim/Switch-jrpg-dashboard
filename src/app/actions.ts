'use server';

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function deleteGameAction(formData: FormData) {
  const id = formData.get('id');

  if (!id) {
    return;
  }

  const { error } = await supabase.from('games').delete().eq('id', id);

  if (error) {
    console.error('ERREUR SUPABASE :', error.message);
  } else {
    console.log('SUCCESS : Jeu supprimé avec succès');
    revalidatePath('/');
  }
}

export async function updateGameAction(formData: FormData) {
  const id = formData.get('id');
  const title = formData.get('title');
  const developer = formData.get('developer');
  const status = formData.get('status');
  const rating = formData.get('rating');
  const image = formData.get('image');
  const summary = formData.get('summary');
  const review = formData.get('review');

  if (!id) return;

  const { error } = await supabase
    .from('games')
    .update({
      title,
      developer,
      status,
      rating: Number(rating),
      image,
      summary,
      review,
    })
    .eq('id', id);

  if (error) {
    console.error('Erreur de mise à jour :', error.message);
    return;
  }

  // Permet de rafraîchir les données instantanément sur la page
  revalidatePath('/');
}
