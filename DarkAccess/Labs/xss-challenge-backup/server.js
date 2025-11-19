// server.js - serve o build do CRA
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const DIST = path.join(__dirname, 'build');

// servir estático
app.use(express.static(DIST));

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(DIST, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`XSS challenge server running on port ${PORT}. Serving ${DIST}`);
});
