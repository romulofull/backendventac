require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

const mongoUri = process.env.MONGO_URI;
// Conexión a MongoDB
mongoose.connect(mongoUri)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error al conectar a MongoDB', err));

// Esquema y modelo de Mongoose
const contactoSchema = new mongoose.Schema({
  nombre: String,
  correo: String,
  mensaje: String
});

const Contacto = mongoose.model('Contacto', contactoSchema);

// Ruta GET para "Hola Mundo" (opcional)
app.get('/api', (req, res) => {
  res.send('Hola Mundo desde la API');
});

// Ruta POST para enviar contacto
app.post('/enviar', async (req, res) => {
  try {
    const contacto = new Contacto(req.body);
    await contacto.save();
    res.status(201).send('Contacto guardado');
  } catch (error) {
    console.error('Error al guardar el contacto', error);
    res.status(400).send('Error al guardar el contacto');
  }
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
