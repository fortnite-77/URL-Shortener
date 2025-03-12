const express = require('express');
const crypto = require('crypto');

const app = express();
const PORT = 3000;

const urlDatabase = {};

app.use(express.json());

function generateShortCode() {
  return crypto.randomBytes(3).toString('hex');
}

app.post('/shorten', (req, res) => {
  const { url } = req.body;
  
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }
  
  const shortCode = generateShortCode();
  urlDatabase[shortCode] = url;

  res.json({ shortUrl: `http://localhost:${PORT}/${shortCode}` });
});

app.get('/:code', (req, res) => {
  const { code } = req.params;
  
  const originalUrl = urlDatabase[code];
  
  if (originalUrl) {
    res.redirect(originalUrl);
  } else {
    res.status(404).json({ error: 'Short URL not found' });
  }
});

app.get('/list', (req, res) => {
  res.json(urlDatabase);
});

app.delete('/:code', (req, res) => {
  const { code } = req.params;
  
  if (urlDatabase[code]) {
    delete urlDatabase[code];
    res.json({ message: 'Short URL deleted' });
  } else {
    res.status(404).json({ error: 'Short URL not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
