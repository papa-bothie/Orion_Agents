async function updateAgent() {
  const email = 'agent1@orion.sn';
  
  try {
    // 1. On cherche l'agent
    const searchRes = await fetch('http://localhost:3000/api/v1/agents');
    const apiResponse = await searchRes.json();
    const agents = apiResponse.data;
    
    const agent = agents.find(a => a.email === email);
    
    if (!agent) {
      console.log("Agent non trouvé.");
      return;
    }
    
    // 2. On le met à jour
    const updateRes = await fetch(`http://localhost:3000/api/v1/agents/${agent.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nom: "DIENG",
        prenom: "Mamadou",
        type: "GENDARMERIE",
        matricule: "GEND-2026-X99",
        grade: "Adjudant",
        service: "Brigade de Recherche",
        telephone: "77 123 45 67",
        photoUrl: "https://images.unsplash.com/photo-1618588507085-c79565432917?w=400&h=400&fit=crop"
      })
    });
    
    const result = await updateRes.json();
    console.log("Mise à jour réussie !", result.data);
  } catch (err) {
    console.error("Erreur:", err);
  }
}

updateAgent();
