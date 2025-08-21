const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Charger les variables d'environnement
dotenv.config();

// Créer l'application Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const channelsRouter = require('./src/routes/channels');
const messagesRouter = require('./src/routes/messages');

app.use('/channels', channelsRouter);
app.use('/messages', messagesRouter);

// Route de base
app.get('/', (req, res) => {
  res.json({ message: 'Backend Channels API' });
});

// Démarrer le planificateur
require('./src/utils/scheduler');

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});