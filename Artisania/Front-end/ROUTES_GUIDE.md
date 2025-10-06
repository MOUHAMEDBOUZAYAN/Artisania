# Guide des Routes Protégées - Artisania

## Vue d'ensemble

Ce projet utilise un système de routes protégées avec différents niveaux d'accès basés sur l'authentification et les rôles utilisateur.

## Types de Routes

### 1. Routes Publiques
Ces routes sont accessibles à tous les utilisateurs, connectés ou non.

- `/` - Page d'accueil
- `/products` - Liste des produits
- `/shops` - Liste des boutiques
- `/shops/:id` - Détails d'une boutique

### 2. Routes Publiques avec Redirection
Ces routes sont accessibles uniquement aux utilisateurs non connectés. Si un utilisateur connecté essaie d'y accéder, il sera redirigé.

- `/login` - Page de connexion
- `/register` - Page d'inscription

### 3. Routes Protégées
Ces routes nécessitent une authentification. Les utilisateurs non connectés seront redirigés vers la page de connexion.

- `/dashboard` - Tableau de bord utilisateur
- `/dashboard/orders` - Commandes de l'utilisateur
- `/cart` - Panier d'achat

### 4. Routes Administrateur
Ces routes nécessitent une authentification ET le rôle administrateur.

- `/dashboard/shop` - Gestion des boutiques
- `/dashboard/products` - Gestion des produits

## Composants de Protection

### ProtectedRoute
```jsx
<ProtectedRoute>
  <MonComposant />
</ProtectedRoute>
```

- Vérifie l'authentification
- Redirige vers `/login` si non connecté
- Affiche un indicateur de chargement pendant la vérification

### AdminRoute
```jsx
<AdminRoute>
  <MonComposantAdmin />
</AdminRoute>
```

- Vérifie l'authentification ET le rôle admin
- Redirige vers `/login` si non connecté
- Affiche une page d'erreur si l'utilisateur n'est pas admin

### PublicRoute
```jsx
<PublicRoute>
  <Login />
</PublicRoute>
```

- Redirige les utilisateurs connectés
- Permet l'accès aux utilisateurs non connectés

## Rôles Utilisateur

- **customer** : Client standard
- **seller** : Vendeur
- **admin** : Administrateur

## Redirection Intelligente

### Après Connexion
- **Clients** : Redirigés vers la page d'origine ou l'accueil
- **Vendeurs/Admins** : Redirigés vers le dashboard

### Après Inscription
- Tous les utilisateurs sont redirigés vers la page d'origine ou l'accueil

## Gestion des Erreurs

### Page 404
- Route `*` pour toutes les URLs non trouvées
- Composant `NotFound` avec navigation de retour

### Accès Refusé
- Page d'erreur pour les utilisateurs non autorisés
- Boutons de navigation pour retourner en arrière

## Exemple d'Utilisation

```jsx
// Dans App.jsx
<Routes>
  {/* Routes publiques */}
  <Route path="/" element={<Home />} />
  <Route path="/products" element={<Products />} />
  
  {/* Routes publiques avec redirection */}
  <Route 
    path="/login" 
    element={
      <PublicRoute>
        <Login />
      </PublicRoute>
    } 
  />
  
  {/* Routes protégées */}
  <Route 
    path="/dashboard" 
    element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    } 
  />
  
  {/* Routes administrateur */}
  <Route 
    path="/dashboard/admin" 
    element={
      <AdminRoute>
        <AdminPanel />
      </AdminRoute>
    } 
  />
  
  {/* Route 404 */}
  <Route path="*" element={<NotFound />} />
</Routes>
```

## Sécurité

- Vérification côté client ET serveur
- Tokens JWT pour l'authentification
- Protection contre l'accès non autorisé
- Gestion des sessions persistantes
