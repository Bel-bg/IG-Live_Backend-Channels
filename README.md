# Backend Channels

Backend pour la fonctionnalité de canaux de discussion de l'application.

## Fonctionnalités

- Création et gestion des canaux de discussion
- Envoi et réception de messages
- Réponses aux messages
- Réactions aux messages
- Suppression automatique des messages de plus de 2 semaines

## Technologies utilisées

- Node.js
- Express.js
- Supabase (base de données)
- ImageKit (stockage d'images)
- node-cron (planification de tâches)

## Installation

1. Cloner le repository
2. Installer les dépendances : `npm install`
3. Configurer les variables d'environnement dans le fichier `.env`
4. Démarrer le serveur : `npm start` ou `npm run dev` pour le mode développement

## Variables d'environnement

- `SUPABASE_URL` : URL de votre projet Supabase
- `SUPABASE_KEY` : Clé d'API de votre projet Supabase
- `IMAGEKIT_PUBLIC_KEY` : Clé publique de votre compte ImageKit
- `IMAGEKIT_PRIVATE_KEY` : Clé privée de votre compte ImageKit
- `IMAGEKIT_URL_ENDPOINT` : URL endpoint de votre compte ImageKit
- `PORT` : Port sur lequel le serveur écoutera (par défaut 3000)

## Structure de la base de données

### Table `channels`

- `id` (UUID) : Identifiant unique du canal
- `name` (TEXT) : Nom du canal
- `image` (TEXT) : URL de l'image du canal
- `joined` (BOOLEAN) : Indique si l'utilisateur a rejoint le canal
- `created_at` (TIMESTAMP) : Date de création du canal

### Table `messages`

- `id` (UUID) : Identifiant unique du message
- `channel_id` (UUID) : Identifiant du canal auquel le message appartient
- `user_id` (UUID) : Identifiant de l'utilisateur qui a envoyé le message
- `content` (TEXT) : Contenu du message
- `image` (TEXT) : URL de l'image jointe au message
- `created_at` (TIMESTAMP) : Date d'envoi du message

### Table `replies`

- `id` (UUID) : Identifiant unique de la réponse
- `message_id` (UUID) : Identifiant du message auquel la réponse appartient
- `user_id` (UUID) : Identifiant de l'utilisateur qui a envoyé la réponse
- `content` (TEXT) : Contenu de la réponse
- `created_at` (TIMESTAMP) : Date d'envoi de la réponse

### Table `reactions`

- `id` (UUID) : Identifiant unique de la réaction
- `message_id` (UUID) : Identifiant du message auquel la réaction appartient
- `user_id` (UUID) : Identifiant de l'utilisateur qui a ajouté la réaction
- `reaction` (TEXT) : Type de réaction (emoji)
- `created_at` (TIMESTAMP) : Date d'ajout de la réaction

## API Endpoints

### Canaux

- `GET /channels` : Récupérer tous les canaux
- `POST /channels` : Créer un nouveau canal
- `POST /channels/:id/join` : Rejoindre un canal

### Messages

- `GET /messages/:channelId` : Récupérer tous les messages d'un canal
- `POST /messages` : Envoyer un nouveau message
- `POST /messages/:messageId/reply` : Répondre à un message
- `POST /messages/:messageId/react` : Ajouter une réaction à un message
- `PUT /messages/:messageId` : Modifier un message
- `DELETE /messages/:messageId` : Supprimer un message

## Planification

Le nettoyage des messages de plus de 2 semaines est planifié pour s'exécuter une fois par jour à minuit.

## Déploiement

Le backend peut être déployé sur Render en utilisant le fichier `render.yaml` fourni.