require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const fs = require('fs');
const https = require('https');
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

// Lendo os certificados SSL gerados pelo Certbot
const privateKey = fs.readFileSync('/etc/letsencrypt/live/app.lojasimples.site/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/app.lojasimples.site/fullchain.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/app.lojasimples.site/chain.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate, ca: ca };
const server = https.createServer(credentials, app);
const io = socketIo(server, {
  cors: {
    origin: 'https://app.lojasimples.site',
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