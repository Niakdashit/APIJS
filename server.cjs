const express = require('express');
const app = express();

const PORT = process.env.PORT || 3001;

app.use(express.json()); // Obligatoire pour parser le JSON POST

app.get('/', (req, res) => {
  res.send('API en ligne ✔️');
});

app.get('/test', (req, res) => {
  res.json({ success: true, message: 'La route /test fonctionne !' });
});

// 👉 Route POST réelle pour tester depuis Hoppscotch/Postman ou un front
app.post('/extract-branding', (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ success: false, error: 'Aucune URL reçue.' });
  }
  // Ici, tu pourrais appeler Brandfetch, GPT, etc.
  res.json({
    success: true,
    message: `URL reçue et traitée`,
    urlReçue: url
  });
});

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
