
const express = require('express');
const app = express();
const PORT = 3001;

app.get('/', (req, res) => {
  res.send('API en ligne ✔️');
});

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
