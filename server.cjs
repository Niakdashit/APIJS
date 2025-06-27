const axios = require('axios');

app.post('/extract-branding', async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ success: false, error: 'Aucune URL reçue.' });
  }

  try {
    // Clé API Browserless
    const apiKey = 'TON_API_KEY_ICI'; // Mets ta vraie clé ici ou dans un .env
    const browserlessUrl = `https://chrome.browserless.io/screenshot?token=${apiKey}`;

    // Demande à Browserless de prendre un screenshot ET d’extraire le DOM/styles
    const script = `
      const getStyle = (selector) => {
        const el = document.querySelector(selector);
        if (!el) return null;
        const cs = getComputedStyle(el);
        return {
          fontFamily: cs.fontFamily,
          fontSize: cs.fontSize,
          color: cs.color,
          backgroundColor: cs.backgroundColor,
          borderRadius: cs.borderRadius
        };
      };
      // Renvoyer DOM et styles via "metadata"
      return {
        dom: document.documentElement.outerHTML,
        styles: {
          body: getStyle('body'),
          h1: getStyle('h1'),
          button: getStyle('button')
        }
      };
    `;

    const payload = {
      url,
      // "metadata": true → pour renvoyer aussi le "return" de ton script ci-dessus dans la réponse,
      metadata: true,
      code: script,
      // Tu peux aussi ajouter "fullPage": true pour un screenshot complet
      options: { fullPage: true }
    };

    const response = await axios.post(browserlessUrl, payload, {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'arraybuffer' // pour recevoir l’image en binaire
    });

    // Récupérer la partie "metadata" qui contient dom/styles
    // (Browserless encode la metadata dans les headers de la réponse)
    const metadata = JSON.parse(
      Buffer.from(
        response.headers['x-browserless-metadata'] || '', // ou {} si absent
        'base64'
      ).toString('utf8')
    );

    // Convertir l’image binaire en base64 pour l’affichage côté client
    const screenshotBase64 = Buffer.from(response.data, 'binary').toString('base64');

    res.json({
      success: true,
      url,
      screenshotBase64,
      dom: metadata.dom?.slice(0, 5000) + '...',
      styles: metadata.styles
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
      details: err.response?.data
    });
  }
});
