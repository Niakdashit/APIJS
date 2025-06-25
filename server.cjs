const express = require('express');
const app = express();

// Utilise le port défini par Render OU 3001 en local
const PORT = process.env.PORT || 3001;

app.get('/', (req, res) => {
  res.send('API en ligne ✔️');
});

// Nouvelle route /test pour vérifier le bon fonctionnement
app.get('/test', (req, res) => {
  res.json({ success: true, message: "La route /test fonctionne !" });
});

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
