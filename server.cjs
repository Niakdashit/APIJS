require('dotenv').config(); // Charge les variables du .env
const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3001;
const BROWSERLESS_API_KEY = process.env.BROWSERLESS_API_KEY;

// Vérifie la présence de la clé API au lancement
if (!BROWSERLESS_API_KEY) {
  console.error('❌ Clé API Browserless manquante dans le .env');
  process.exit(1);
}

app.get('/', (req, res) => {
  res.send('API en ligne ✔️');
});

// Route de test
app.get('/test', (req, res) => {
  res.json({ success: true, message: 'La route /test fonctionne !' });
});

// Route principale
app.post('/extract-branding', async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ success: false, error: 'Aucune URL reçue.' });
  }

  try {
    // Script JS à exécuter sur la page pour récupérer des styles
    const script = `
      () => {
        const getStyle = (selector) => {
          const el = document.querySelector(selector);
          if (!el) return null;
          const cs = window.getComputedStyle(el);
          return {
            fontFamily: cs.fontFamily,
            fontSize: cs.fontSize,
            color: cs.color,
            backgroundColor: cs.backgroundColor,
            borderRadius: cs.borderRadius
          };
        };
        return {
          body: getStyle('body'),
          h1: getStyle('h1'),
          button: getStyle('button'),
          a: getStyle('a')
        };
      }
    `;

    const BROWSERLESS_API_URL = process.env.BROWSERLESS_API_URL || "https://production-s0.browserless.io";
    const browserlessUrl = `${BROWSERLESS_API_URL}/function?token=${BROWSERLESS_API_KEY}`;

    // Appel à Browserless
    const response = await axios.post(
      browserlessUrl,
      {
        code: script,
        context: { url }
      },
      { headers: { 'Content-Type': 'application/json' } }
    );

    res.json({
      success: true,
      data: response.data,
      url: url
    });

  } catch (err) {
    console.error('Erreur Browserless:', err.response?.data || err.message);
    res.status(500).json({
      success: false,
      error: err.response?.data || err.message
    });
  }
});

// Le serveur démarre ici AVEC backticks pour utiliser la variable PORT
app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
