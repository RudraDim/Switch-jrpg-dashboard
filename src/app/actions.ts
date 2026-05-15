'use server'

import { supabase } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

export async function deleteGameAction(formData: FormData) {
  const id = formData.get('id');

  if (!id) {
    return;
  }

  const { error } = await supabase
    .from('games')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("ERREUR SUPABASE :", error.message);
  } else {
    console.log("SUCCESS : Jeu supprimé avec succès");
    revalidatePath('/');
  }
}