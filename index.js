const express = require('express');
const app = express();

app.use(express.json());

// ⚠️ VULNERABILIDAD 1: Code Injection
// El input del usuario llega directo a eval() — un atacante puede
// ejecutar cualquier código JavaScript en el servidor
app.post('/calcular', (req, res) => {
  const formula = req.body.formula;
  const resultado = eval(formula);   // ← CodeQL detectará esto
  res.json({ resultado });
});

// ⚠️ VULNERABILIDAD 2: Path Traversal
// El input del usuario se usa directamente para construir una ruta de archivo
// Un atacante puede pedir /../../../etc/passwd y leer archivos del servidor
const path = require('path');
const fs   = require('fs');

app.get('/archivo', (req, res) => {
  const nombre = req.query.nombre;
  const ruta   = path.join('/archivos', nombre);  // ← CodeQL detectará esto
  res.sendFile(ruta);
});

app.listen(3000);