const http = require('http');

const data = JSON.stringify({
  nom: "Agent",
  prenom: "Testeur",
  email: "agent1@orion.sn",
  motDePasse: "123456",
  telephone: "770000001"
});

const options = {
  hostname: '127.0.0.1',
  port: 3000,
  path: '/api/v1/agents',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let output = '';
  res.on('data', (d) => { output += d; });
  res.on('end', () => { console.log(output); });
});

req.on('error', (error) => { console.error('Erreur API backend:', error.message); });
req.write(data);
req.end();
