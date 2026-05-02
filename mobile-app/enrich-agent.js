const http = require('http');

// On va mettre à jour l'agent agent1@orion.sn avec des données riches
const data = JSON.stringify({
  nom: "DIOP",
  prenom: "Ousmane",
  email: "agent1@orion.sn",
  motDePasse: "123456",
  telephone: "77 123 45 67",
  type: "GENDARMERIE",
  matricule: "GN-2024-8892",
  grade: "Adjudant-Chef",
  service: "Brigade de Recherches - Thiès",
  photoUrl: "https://images.unsplash.com/photo-1618588507085-c79565432917?w=400&h=400&fit=crop"
});

const options = {
  hostname: '127.0.0.1',
  port: 3000,
  path: '/api/v1/agents', // On utilise POST pour créer un nouvel agent propre si besoin
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let output = '';
  res.on('data', (d) => { output += d; });
  res.on('end', () => { 
    console.log("Résultat de la création/mise à jour :");
    console.log(output); 
  });
});

req.on('error', (error) => { console.error('Erreur API backend:', error.message); });
req.write(data);
req.end();
