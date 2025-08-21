const supabase = require('../lib/supabase');

// Fonction pour supprimer les messages de plus de 2 semaines
const cleanupOldMessages = async () => {
  try {
    // Calculer la date d'il y a 2 semaines
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    // Supprimer les messages plus anciens que 2 semaines
    const { error } = await supabase
      .from('messages')
      .delete()
      .lt('created_at', twoWeeksAgo.toISOString());

    if (error) throw error;

    console.log('Nettoyage des anciens messages terminé');
  } catch (error) {
    console.error('Erreur lors du nettoyage des anciens messages:', error);
  }
};

module.exports = cleanupOldMessages;