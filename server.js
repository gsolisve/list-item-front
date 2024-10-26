const express = require('express');
const path = require('path');
const app = express();

// Sirve los archivos estáticos desde el directorio dist
app.use(express.static(path.join(__dirname, 'dist/front-list-items')));

// Maneja las rutas de Angular enviando index.html
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'dist/front-list-items/index.html'));
});

// Inicia el servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
