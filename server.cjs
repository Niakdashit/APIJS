const express = require('express');
const app = express();

// Utilise le port défini par Render OU 3001 en local
const PORT = process.env.PORT || 3001;

app.get('/', (req, res) => {
  res.send('API en ligne ✔️');
});

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
