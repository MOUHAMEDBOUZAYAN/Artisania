# Artisania Backend API

API REST pour la plateforme Artisania - Marketplace d'artisanat.

## 🚀 Technologies utilisées

- **Node.js** + **Express.js** - Serveur web
- **MongoDB** + **Mongoose** - Base de données
- **JWT** - Authentification
- **Bcrypt** - Hachage des mots de passe
- **Express-validator** - Validation des données

## 📦 Installation

1. **Installer les dépendances :**
```bash
npm install
```

2. **Configurer les variables d'environnement :**
```bash
cp env.example .env
```

3. **Démarrer MongoDB :**
```bash
# Local MongoDB
mongod

# Ou utiliser MongoDB Atlas
```

4. **Démarrer le serveur de développement :**
```bash
npm run dev
```

## 🔧 Configuration

### Variables d'environnement

Copiez `env.example` vers `.env` et configurez :

```env
# Base de données
MONGODB_URI=mongodb://localhost:27017/artisania

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d

# Serveur
PORT=5000
NODE_ENV=development

# CORS
FRONTEND_URL=http://localhost:3000
```

## 📚 API Endpoints

### 🔐 Authentication
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/me` - Profil utilisateur
- `POST /api/auth/logout` - Déconnexion

### 🛍️ Products
- `GET /api/products` - Liste des produits
- `GET /api/products/:id` - Détail produit
- `GET /api/products/category/:category` - Produits par catégorie
- `GET /api/products/search/:query` - Recherche
- `POST /api/products` - Créer produit (Seller)
- `PUT /api/products/:id` - Modifier produit
- `DELETE /api/products/:id` - Supprimer produit

### 🏪 Shops
- `GET /api/shops` - Liste des boutiques
- `GET /api/shops/:id` - Détail boutique
- `GET /api/shops/featured` - Boutiques mises en avant
- `GET /api/shops/category/:category` - Boutiques par catégorie
- `POST /api/shops` - Créer boutique (Seller)
- `PUT /api/shops/:id` - Modifier boutique

## 🏗️ Structure du projet

```
Back-end/
├── controllers/     # Contrôleurs MVC
│   ├── auth.js      # Authentification
│   ├── product.js   # Produits
│   └── shop.js      # Boutiques
├── models/         # Modèles Mongoose
│   ├── User.js      # Utilisateur
│   ├── Product.js   # Produit
│   ├── Shop.js      # Boutique
│   └── Order.js     # Commande
├── routes/         # Routes API
│   ├── auth.js      # Routes auth
│   ├── product.js   # Routes produits
│   └── shop.js      # Routes boutiques
├── middleware/     # Middlewares
│   └── auth.js      # Authentification
├── config/         # Configuration
│   └── database.js  # Base de données
├── app.js          # Application principale
└── package.json    # Dépendances
```

## 🔍 Exemples d'utilisation

### Inscription
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "buyer"
  }'
```

### Connexion
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Lister les produits
```bash
curl http://localhost:5000/api/products?page=1&limit=10&category=ceramics
```

## 🧪 Tests

```bash
# Lancer les tests (à venir)
npm test

# Tests en mode watch
npm run test:watch
```

## 🚀 Déploiement

```bash
# Build pour production
npm run build

# Démarrer en production
npm start
```

## 📝 Scripts disponibles

- `npm start` - Démarrer en production
- `npm run dev` - Démarrer en développement avec nodemon
- `npm test` - Lancer les tests

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature
3. Commit les changements
4. Push vers la branche
5. Ouvrir une Pull Request

## 📄 Licence

MIT License - voir le fichier LICENSE pour plus de détails.
