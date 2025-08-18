// server.js
const express = require('express');
const QRCode = require('qrcode');

const app = express();
const LOGIN_URL = process.env.LOGIN_URL || 'https://your-domain.com/login';

app.get('/login-qr.png', async (req, res) => {
  res.type('image/png');
  await QRCode.toFileStream(res, LOGIN_URL, {
    width: 512,
    errorCorrectionLevel: 'M',
    margin: 2
  });
});

app.listen(3000, () => console.log('QR server at http://localhost:3000/login-qr.png'));
