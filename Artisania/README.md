# Artisania - Marketplace d'Artisanat

Plateforme web permettant aux artisans de créer une boutique en ligne pour présenter et vendre leurs produits faits main.

## 🏗️ Architecture

- **Frontend**: React.js + Vite + Tailwind CSS
- **Backend**: Node.js + Express.js + MongoDB
- **Authentification**: JWT
- **Hébergement**: Docker

## 📁 Structure du Projet

```
Artisania/
├── Front-end/          # Application React
│   ├── src/
│   │   ├── components/ # Composants React
│   │   ├── pages/      # Pages de l'application
│   │   ├── services/   # Services API
│   │   ├── hooks/      # Hooks personnalisés
│   │   ├── context/    # Contextes React
│   │   └── utils/      # Fonctions utilitaires
│   └── Dockerfile
├── Back-end/           # API REST
│   ├── src/
│   │   ├── controllers/ # Contrôleurs MVC
│   │   ├── models/     # Modèles MongoDB
│   │   ├── routes/     # Routes API
│   │   ├── middleware/ # Middlewares
│   │   └── services/   # Logique métier
│   └── Dockerfile
└── docker-compose.yml  # Orchestration Docker
```

## 🚀 Démarrage Rapide

### Avec Docker (Recommandé)

```bash
# Cloner le projet
git clone <repository-url>
cd Artisania

# Démarrer tous les services
docker-compose up --build
```

### Développement Local

#### Backend
```bash
cd Back-end
npm install
cp .env.example .env
npm run dev
```

#### Frontend
```bash
cd Front-end
npm install
npm run dev
```

## 📋 Fonctionnalités

### 👤 Espace Acheteur
- Inscription/Connexion
- Navigation et recherche de produits
- Panier d'achat
- Historique des commandes
- Avis et notation

### 🏪 Espace Vendeur
- Création de boutique
- Gestion du catalogue
- Suivi des commandes
- Statistiques de vente

### ⚙️ Espace Administrateur
- Gestion des utilisateurs
- Modération des contenus
- Tableau de bord global

## 🔧 Technologies

- **Frontend**: React 18, Vite, Tailwind CSS, React Router
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Authentification**: JWT, bcrypt
- **Stockage**: Cloudinary (images)
- **Déploiement**: Docker, Docker Compose
