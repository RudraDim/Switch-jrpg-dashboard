import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Recréation du fameux __dirname manquant en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Colle ton JSON de jeux récupéré de Supabase ici
const games = [
  {
    id: 2,
    title: 'Persona 5 Royal',
    developer: 'Atlus',
    status: 'Terminé',
    rating: 98,
    image: 'https://m.media-amazon.com/images/I/81FI0CVCgML.jpg',
    created_at: '2026-05-14 15:05:21.37112+00',
  },
  {
    id: 3,
    title: 'Fire Emblem Engage',
    developer: 'Intelligent Systems',
    status: 'À faire',
    rating: 85,
    image: 'https://m.media-amazon.com/images/I/81zvbbfiHyL.jpg',
    created_at: '2026-05-14 15:05:21.37112+00',
  },
  {
    id: 4,
    title: 'Dragon Quest XI',
    developer: 'Square Enix',
    status: 'À faire',
    rating: 92,
    image: ' https://m.media-amazon.com/images/I/71h7LlFFXqL.jpg',
    created_at: '2026-05-14 15:17:24.937024+00',
  },
  {
    id: 10,
    title: 'Octopath Traveler',
    developer: 'Square Enix',
    status: 'À faire',
    rating: 61,
    image: 'https://m.media-amazon.com/images/I/91S5XDfnr4L._AC_UF894,1000_QL80_.jpg',
    created_at: '2026-05-15 12:16:09.224555+00',
  },
  {
    id: 1,
    title: 'Xenoblade Chronicles 3',
    developer: 'Monolith Soft',
    status: 'En cours',
    rating: 95,
    image: 'https://m.media-amazon.com/images/I/71Pluyo5-QL._AC_SX679_.jpg',
    created_at: '2026-05-14 15:05:21.37112+00',
  },
  {
    id: 11,
    title: 'Xenoblade Chronicles 2',
    developer: 'Monolith Soft',
    status: 'À faire',
    rating: 93,
    image: 'https://m.media-amazon.com/images/I/81F7Ib0y3lL._AC_UF894,1000_QL80_.jpg',
    created_at: '2026-05-15 12:41:02.565935+00',
  },
  {
    id: 12,
    title: 'Final Fantasy Tactics',
    developer: 'Square Enix',
    status: 'À faire',
    rating: 95,
    image: 'https://m.media-amazon.com/images/I/81SJ0ghJTxL._AC_UF1000,1000_QL80_.jpg',
    created_at: '2026-05-15 13:54:54.64652+00',
  },
  {
    id: 14,
    title: 'Fire Emblem Threehouse',
    developer: 'Intelligent Systems',
    status: 'En cours',
    rating: 85,
    image: 'https://m.media-amazon.com/images/I/81BcRxkhtVL.jpg',
    created_at: '2026-05-15 15:58:51.47396+00',
  },
  {
    id: 16,
    title: 'Xenoblade Chronicles 3 Definitive Edition',
    developer: 'Monolith Soft',
    status: 'Terminé',
    rating: 97,
    image: 'https://m.media-amazon.com/images/I/91FD6Isz6LL._AC_UF1000,1000_QL80_.jpg',
    created_at: '2026-05-15 16:25:21.230713+00',
  },
  {
    id: 17,
    title: 'FInal Fantasy X',
    developer: 'Square Enix',
    status: 'En cours',
    rating: 93,
    image: 'https://m.media-amazon.com/images/I/81JaaHZ8-wL.jpg',
    created_at: '2026-05-16 06:55:07.332713+00',
  },
  {
    id: 18,
    title: 'Final Fantasy XII',
    developer: 'Square Enix',
    status: 'En cours',
    rating: 98,
    image: 'https://m.media-amazon.com/images/I/71TfQzpBJhL._AC_UF894,1000_QL80_.jpg',
    created_at: '2026-05-16 06:55:47.148977+00',
  },
  {
    id: 19,
    title: 'I am Setsuna',
    developer: 'Square Enix',
    status: 'À faire',
    rating: 50,
    image: 'https://m.media-amazon.com/images/I/81OqbScuCqL.jpg',
    created_at: '2026-05-16 06:56:58.913484+00',
  },
  {
    id: 20,
    title: 'Monster Hunter Story 2',
    developer: 'Capcom',
    status: 'En cours',
    rating: 75,
    image: 'https://m.media-amazon.com/images/I/917bHImhlyS.jpg',
    created_at: '2026-05-16 06:58:52.202174+00',
  },
  {
    id: 21,
    title: 'Persona 4 Golden',
    developer: 'Atlus',
    status: 'À faire',
    rating: 82,
    image: 'https://m.media-amazon.com/images/I/71n-UAbhteL._AC_UF894,1000_QL80_.jpg',
    created_at: '2026-05-16 07:00:49.914068+00',
  },
  {
    id: 22,
    title: 'Sega Ages Phantasy Star',
    developer: 'Sega',
    status: 'À faire',
    rating: 50,
    image: 'https://images.launchbox-app.com/ee95b6c1-b946-4179-b168-17754c49302e.jpg',
    created_at: '2026-05-16 07:02:03.543496+00',
  },
  {
    id: 23,
    title: 'Shin Megami Tensei III: Nocturne HD Remaster',
    developer: 'Atlus',
    status: 'À faire',
    rating: 50,
    image: 'https://m.media-amazon.com/images/I/51IIfAKL7nL.jpg',
    created_at: '2026-05-16 07:03:09.385506+00',
  },
  {
    id: 24,
    title: 'Shin Megami Tensei V',
    developer: 'Atlus',
    status: 'En cours',
    rating: 85,
    image: 'https://m.media-amazon.com/images/I/71H+ZKBtxbL._AC_UF1000,1000_QL80_.jpg',
    created_at: '2026-05-16 07:04:14.85869+00',
  },
  {
    id: 13,
    title: 'Grandia Collection 2',
    developer: 'Arc System Works',
    status: 'En cours',
    rating: 51,
    image: 'https://m.media-amazon.com/images/I/718yukh-M4L.jpg',
    created_at: '2026-05-15 14:01:20.926208+00',
  },
];
const downloadDir = path.join(__dirname, 'jaquettes_temp');

if (!fs.existsSync(downloadDir)) {
  fs.mkdirSync(downloadDir);
}

async function download() {
  for (const game of games) {
    if (!game.image) continue;

    try {
      const response = await fetch(game.image);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const buffer = Buffer.from(await response.arrayBuffer());
      const cleanTitle = game.title.replace(/[^a-zA-Z0-9]/g, '_');
      const filename = path.join(downloadDir, `${cleanTitle}.jpg`);

      fs.writeFileSync(filename, buffer);
      console.log(`✅ Téléchargé : ${game.title}`);
    } catch (err) {
      console.error(`❌ Échec pour ${game.title} :`, err.message);
    }
  }
}

download();
