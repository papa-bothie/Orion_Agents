const { Client } = require('pg');

async function updateAgent() {
  const client = new Client({
    connectionString: "postgresql://postgres:postgres@localhost:5432/orion_db" // Ajustez si nécessaire
  });

  try {
    await client.connect();
    
    // On met à jour l'agent avec l'email agent1@orion.sn
    const query = `
      UPDATE agents
      SET 
        nom = 'DIENG',
        prenom = 'Mamadou',
        type = 'GENDARMERIE',
        matricule = 'GEND-2026-X99',
        grade = 'Adjudant',
        service = 'Brigade de Recherche',
        telephone = '77 123 45 67',
        photo_url = 'https://images.unsplash.com/photo-1618588507085-c79565432917?w=400&h=400&fit=crop'
      WHERE email = 'agent1@orion.sn';
    `;

    const res = await client.query(query);
    console.log(`Mise à jour réussie : ${res.rowCount} ligne(s) modifiée(s).`);
  } catch (err) {
    console.error('Erreur lors de la mise à jour SQL:', err);
  } finally {
    await client.end();
  }
}

updateAgent();
