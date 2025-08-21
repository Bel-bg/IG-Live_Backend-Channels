const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabase');
const imagekit = require('../lib/imagekit');

// Obtenir tous les messages d'un canal
router.get('/:channelId', async (req, res) => {
  try {
    const { channelId } = req.params;
    
    // Récupérer les messages du canal
    const { data: messages, error } = await supabase
      .from('messages')
      .select('*')
      .eq('channel_id', channelId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    res.json(messages);
  } catch (error) {
    console.error('Erreur lors de la récupération des messages:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Envoyer un nouveau message
router.post('/', async (req, res) => {
  try {
    const { channelId, userId, content, image } = req.body;
    
    let imageUrl = null;
    
    // Télécharger l'image si elle existe
    if (image) {
      const uploadResult = await imagekit.upload({
        file: image,
        fileName: `message_${Date.now()}.jpg`,
      });
      imageUrl = uploadResult.url;
    }
    
    // Créer le message
    const { data, error } = await supabase
      .from('messages')
      .insert([{
        channel_id: channelId,
        user_id: userId,
        content,
        image: imageUrl
      }])
      .select();

    if (error) throw error;

    res.status(201).json(data[0]);
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Répondre à un message
router.post('/:messageId/reply', async (req, res) => {
  try {
    const { messageId } = req.params;
    const { userId, content } = req.body;
    
    // Créer la réponse
    const { data, error } = await supabase
      .from('replies')
      .insert([{
        message_id: messageId,
        user_id: userId,
        content
      }])
      .select();

    if (error) throw error;

    res.status(201).json(data[0]);
  } catch (error) {
    console.error('Erreur lors de la réponse au message:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Ajouter une réaction à un message
router.post('/:messageId/react', async (req, res) => {
  try {
    const { messageId } = req.params;
    const { userId, reaction } = req.body;
    
    // Vérifier si l'utilisateur a déjà réagi avec cette réaction
    const { data: existingReaction, error: fetchError } = await supabase
      .from('reactions')
      .select('*')
      .eq('message_id', messageId)
      .eq('user_id', userId)
      .eq('reaction', reaction);

    if (fetchError) throw fetchError;

    if (existingReaction.length > 0) {
      // Retirer la réaction
      const { error: deleteError } = await supabase
        .from('reactions')
        .delete()
        .eq('id', existingReaction[0].id);

      if (deleteError) throw deleteError;

      res.json({ message: 'Réaction retirée' });
    } else {
      // Ajouter la réaction
      const { data, error: insertError } = await supabase
        .from('reactions')
        .insert([{
          message_id: messageId,
          user_id: userId,
          reaction
        }])
        .select();

      if (insertError) throw insertError;

      res.status(201).json(data[0]);
    }
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la réaction:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Modifier un message
router.put('/:messageId', async (req, res) => {
  try {
    const { messageId } = req.params;
    const { content } = req.body;
    
    // Mettre à jour le message
    const { data, error } = await supabase
      .from('messages')
      .update({ content })
      .eq('id', messageId)
      .select();

    if (error) throw error;

    res.json(data[0]);
  } catch (error) {
    console.error('Erreur lors de la modification du message:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Supprimer un message
router.delete('/:messageId', async (req, res) => {
  try {
    const { messageId } = req.params;
    
    // Supprimer le message
    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', messageId);

    if (error) throw error;

    res.json({ message: 'Message supprimé' });
  } catch (error) {
    console.error('Erreur lors de la suppression du message:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;