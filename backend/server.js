require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const socketIo = require('socket.io');
const billRoutes = require("./routes/billRoutes");
const reportRoutes = require("./routes/reportRoutes");
const moment = require('moment-timezone');

connectDB();

const app = express();
app.use(express.json());

const brasiliaTime = moment().tz("America/Sao_Paulo").toDate();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
}));

const authRoutes = require('./routes/authRoutes');
const clientRoutes = require('./routes/clientRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/client', clientRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use("/api/bills", billRoutes);
app.use("/api/reports", reportRoutes);

// Rota Webhooks
const webhookRoutes = require('./routes/webhookRoutes');
app.use('/api', webhookRoutes);

const passwordRoutes = require('./routes/passwordRoutes');
app.use('/api', passwordRoutes);


const server = require('http').createServer(app);

const io = socketIo(server, {
  cors: {
    origin: (origin, callback) => {
      console.log('Socket.IO origem permitida:', origin);
      callback(null, true); // permite todas as origens
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
  }
});

// Configuração do Socket.IO
io.on('connection', (socket) => {  
  socket.on('disconnect', () => {
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});