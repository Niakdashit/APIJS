const express = require('express');
const app = express();

const PORT = process.env.PORT || 3001;

// Permet de parser le JSON dans les requêtes POST
app.use(express.json());

// Route GET racine (pour test rapide)
app.get('/', (req, res) => {
  res.send('API en ligne ✔️');
});

// Route GET de test (retourne un objet JSON)
app.get('/test', (req, res) => {
  res.json({ success: true, message: 'La route /test fonctionne !' });
});

// Route POST réelle à utiliser dans Hoppscotch/Postman ou ton front
app.post('/extract-branding', (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ success: false, error: 'Aucune URL reçue.' });
  }
  // Simule le traitement (Brandfetch, GPT, etc. à mettre ici plus tard)
  res.json({
    success: true,
    message: `URL reçue et traitée`,
    urlReçue: url
  });
});

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
