const cron = require('node-cron');
const cleanupOldMessages = require('../cron/cleanup');

// Planifier le nettoyage des anciens messages une fois par jour à minuit
cron.schedule('0 0 * * *', () => {
  console.log('Exécution du nettoyage des anciens messages...');
  cleanupOldMessages();
});

console.log('Planificateur démarré: nettoyage des anciens messages une fois par jour à minuit');