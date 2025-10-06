// Tests simples pour 3 routes API essentielles

const request = require('supertest');

// Mock simple de l'application Express
const express = require('express');
const app = express();

app.use(express.json());

// Routes simples pour les tests
app.post('/api/auth/register', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email et mot de passe requis' });
  }
  
  if (password.length < 6) {
    return res.status(400).json({ error: 'Mot de passe trop court' });
  }
  
  res.status(201).json({ message: 'Utilisateur créé' });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email et mot de passe requis' });
  }
  
  res.status(200).json({ message: 'Connexion réussie', token: 'fake-token' });
});

app.get('/api/products', (req, res) => {
  res.status(200).json({ 
    products: [
      { id: 1, name: 'Produit 1', price: 10.50 },
      { id: 2, name: 'Produit 2', price: 25.00 }
    ] 
  });
});

// Tests
describe('Tests Simples - 3 Routes API', () => {
  
  // Test 1: POST /api/auth/register
  test('Inscription - Succès', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });
    
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Utilisateur créé');
  });

  test('Inscription - Échec (données manquantes)', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({});
    
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Email et mot de passe requis');
  });

  // Test 2: POST /api/auth/login
  test('Connexion - Succès', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });
    
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Connexion réussie');
  });

  test('Connexion - Échec (données manquantes)', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({});
    
    expect(response.status).toBe(400);
  });

  // Test 3: GET /api/products
  test('Liste des produits - Succès', async () => {
    const response = await request(app)
      .get('/api/products');
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.products)).toBe(true);
    expect(response.body.products.length).toBe(2);
  });
});
