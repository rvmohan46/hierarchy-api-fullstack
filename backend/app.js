const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const bfhlRoute = require('./routes/bfhl');
const app = express();
app.use(cors());
app.use(express.json());

const frontendDist = path.join(__dirname, '..', 'frontend', 'dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
}

app.use('/bfhl', bfhlRoute);

app.get('/', (req, res) => {
  if (fs.existsSync(frontendDist)) {
    return res.sendFile(path.join(frontendDist, 'index.html'));
  }
  res.json({ status: 'ok', message: 'BFHL backend is running.' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
