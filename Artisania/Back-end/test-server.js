const express = require('express');
const app = express();

const PORT = process.env.PORT || 5001;

app.get('/', (req, res) => {
  res.json({ 
    message: 'Test server is working!',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`✅ Test server is running on port ${PORT}`);
  console.log(`🔗 Test URL: http://localhost:${PORT}`);
});
