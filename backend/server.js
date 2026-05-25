require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.listen(3000, () => {
    console.log("Server running");
});

const equipmentRoutes =
    require('./routes/equipmentRoutes');

app.use(equipmentRoutes);

const authRoutes =
require('./routes/authRoutes');

app.use(authRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});