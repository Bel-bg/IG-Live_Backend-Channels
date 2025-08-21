const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabase');

// Obtenir tous les canaux
router.get('/', async (req, res) => {
  try {
    // Récupérer les canaux rejoints par l'utilisateur
    const { data: joinedChannels, error: joinedError } = await supabase
      .from('channels')
      .select('*')
      .eq('joined', true);

    if (joinedError) throw joinedError;

    // Récupérer les autres canaux
    const { data: availableChannels, error: availableError } = await supabase
      .from('channels')
      .select('*')
      .eq('joined', false);

    if (availableError) throw availableError;

    res.json({
      joinedChannels,
      availableChannels
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des canaux:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Créer un nouveau canal
router.post('/', async (req, res) => {
  try {
    const { name, image } = req.body;
    
    // Créer le canal
    const { data, error } = await supabase
      .from('channels')
      .insert([{ name, image, joined: true }])
      .select();

    if (error) throw error;

    res.status(201).json(data[0]);
  } catch (error) {
    console.error('Erreur lors de la création du canal:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Rejoindre un canal
router.post('/:id/join', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Mettre à jour le canal
    const { data, error } = await supabase
      .from('channels')
      .update({ joined: true })
      .eq('id', id)
      .select();

    if (error) throw error;

    res.json(data[0]);
  } catch (error) {
    console.error('Erreur lors du rejoindre du canal:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;