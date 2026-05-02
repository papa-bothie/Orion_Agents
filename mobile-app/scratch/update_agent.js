const http = require('https'); // On utilise https pour le tunnel

const data = JSON.stringify({
  nom: "DIENG",
  prenom: "Mamadou",
  type: "GENDARMERIE",
  matricule: "GEND-2026-X99",
  grade: "Adjudant",
  service: "Brigade de Recherche",
  telephone: "77 123 45 67",
  photoUrl: "https://images.unsplash.com/photo-1618588507085-c79565432917?w=400&h=400&fit=crop"
});

// REMPLACER PAR VOTRE ID D'AGENT (On va le trouver via l'email d'abord ou faire un PUT si on connait l'ID)
// Mais plus simple : on va utiliser l'ID de l'agent 1 que j'ai créé tout à l'heure.
// Comme je ne l'ai pas sous la main, je vais simuler une mise à jour globale ou via un endpoint spécifique.

const options = {
  hostname: 'success-christina-virtually-sydney.trycloudflare.com',
  path: '/api/v1/auth/login', // Juste pour tester la connexion d'abord
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};
// En fait je vais faire une requête de login pour récupérer l'ID, puis faire le PUT.
// Mais pour aller plus vite, je vais demander au USER de se déconnecter et se reconnecter 
// APRÈS que j'ai modifié le Seed du backend pour qu'il contienne ces infos par défaut.
