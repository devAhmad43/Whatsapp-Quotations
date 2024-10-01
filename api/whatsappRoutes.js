const express = require("express");
const { client, initializeWhatsAppClient, getQrCode, sendMessage, getStatus, logoutClient, } = require('../utils/whatsappClient');
const router = express.Router();

// Initialize the WhatsApp client
initializeWhatsAppClient();

// API endpoint to retrieve the QR code
router.get("/qr", getQrCode);
// router.get("/newQr", updateQr);
// API endpoint to send a WhatsApp message
router.post("/send-message", sendMessage);
// API endpoint to check if the client is ready
router.get("/status", getStatus);
// API endpoint to logout
router.post("/logout", logoutClient);
module.exports = router;
