const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode");
const qrcodeTerminal = require("qrcode-terminal");

let qrCodeImage;  // Variable to store QR code image
let clientReady = false;  // To check if the client is ready

// Initialize WhatsApp client with LocalAuth and Puppeteer options
const client = new Client({
  puppeteer: {
    headless: true, // Set to false for debugging (shows browser window)
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--no-zygote",
      "--disable-gpu",
    ],
    timeout: 86400000 // 1 day in milliseconds
  },
  authStrategy: new LocalAuth(), // Persists session data locally
});

// Event listeners for the WhatsApp client
client.on("qr", (qr) => {
  console.log("QR code received, generating image...");

  // Display QR code in the terminal as ASCII
  qrcodeTerminal.generate(qr, { small: true });

  // Generate QR code image (optional for use in an API or frontend)
  qrcode.toDataURL(qr, (err, url) => {
    if (err) {
      console.error("Error generating QR code:", err);
      return;
    }
    qrCodeImage = url; // Store the QR code image
  });
});

client.on("ready", () => {
  console.log("WhatsApp client is ready!");
  clientReady = true;
  qrCodeImage = null; // Clear the QR code after a successful connection
});

client.on('authenticated', () => {
  console.log('Client authenticated');
});

client.on('auth_failure', (msg) => {
  console.error('Authentication failure:', msg);
});

client.on('disconnected', async (reason) => {
  console.log('Client was logged out. Reason:', reason);
  clientReady = false; // Reset client readiness
  try {
    await client.initialize(); // Re-initialize the client to reconnect
  } catch (error) {
    console.error('Error during reinitialization:', error);
  }
});

// Initialize the WhatsApp client with async handling
const initializeWhatsAppClient = async () => {
  try {
    await client.initialize();
  } catch (error) {
    console.error('Error initializing WhatsApp client:', error);
  }

  // Periodically check and refresh client state to keep the session alive
  setInterval(async () => {
    try {
      if (!clientReady) {
        console.log('Client not ready, skipping keep-alive check.');
        return;
      }

      const state = await client.getState();
      console.log('Client state:', state);
    } catch (error) {
      console.error('Error getting client state. Reconnecting...', error);
      try {
        await client.initialize(); // Reinitialize the client if disconnected
      } catch (initError) {
        console.error('Reinitialization failed:', initError);
      }
    }
  }, 900000); // Check every 15 minutes
};

// Endpoint handlers

const getQrCode = async (req, res) => {
  try {
    if (clientReady) {
      return res.send(`
        <html>
          <body>
            <h1>Client is already connected!</h1>
          </body>
        </html>
      `);
    } else if (qrCodeImage) {
      return res.send(`
        <html>
          <body>
            <img src="${qrCodeImage}" alt="QR Code">
          </body>
        </html>
      `);
    } else {
      return res.send(`
        <html>
          <body>
            <h1>QR Code not generated yet. Please wait...</h1>
          </body>
        </html>
      `);
    }
  } catch (error) {
    console.error('Error handling QR code:', error);
    res.status(500).json({ error: 'Failed to generate or display QR code.' });
  }
};

const sendMessage = async (req, res) => {
  try {
    if (!clientReady) {
      return res.status(400).json({
        error: "WhatsApp client is not ready. Please scan the QR code first.",
      });
    }

    const { numbers, message } = req.body;
    console.log('Send WhatsApp Message to:', numbers);

    // Validate request data
    if (!numbers || !message) {
      return res.status(400).json({
        error: "Phone numbers and message are required.",
      });
    }

    if (!Array.isArray(numbers) || numbers.length === 0) {
      return res.status(400).json({
        error: "Phone numbers should be an array with at least one number.",
      });
    }

    // Process each phone number
    const results = await Promise.all(numbers.map(async (number) => {
      try {
        // Format the phone number for WhatsApp (Pakistan format: +92)
        let formattedPhoneNumber = number.replace(/\D/g, "");
        // If number doesn't start with 92, add it
        if (!formattedPhoneNumber.startsWith("92")) {
          formattedPhoneNumber = `92${formattedPhoneNumber.startsWith("0") ? formattedPhoneNumber.substring(1) : formattedPhoneNumber}`;
        }
        formattedPhoneNumber += "@c.us";

        const isRegistered = await client.isRegisteredUser(formattedPhoneNumber);
        if (!isRegistered) {
          return { number, success: false, error: "The phone number is not registered on WhatsApp." };
        }

        await client.sendMessage(formattedPhoneNumber, message);
        return { number, success: true, message: "Message sent successfully." };
      } catch (error) {
        return { number, success: false, error: "Failed to send message.", details: error.toString() };
      }
    }));
    res.json({ results });
  } catch (error) {
    console.error("Error sending messages:", error);
    res.status(500).json({
      error: "Failed to send messages.",
      details: error.toString(),
    });
  }
};

const getStatus = async (req, res) => {
  try {
    console.log('Status API Call');

    if (clientReady) {
      const state = await client.getState(); // Ensure client is ready before calling getState
      console.log('Connection state:', state);
      return res.json({ message: "Client is ready!", state });
    } else {
      return res.json({ message: "Waiting for QR code scan..." });
    }
  } catch (error) {
    console.error('Error getting state:', error);
    res.status(500).json({ message: "Failed to get client status.", error: error.toString() });
  }
};

const logoutClient = async (req, res) => {
  try {
    console.log('Attempting to log out client...');
    const result = await client.logout();
    console.log('Logout result:', result); // Check the result of logout
    res.json({ success: true, message: "Logged out successfully." });
  } catch (error) {
    console.error("Error during logout:", error.stack); // Detailed error stack
    res.status(500).json({
      error: "Failed to logout.",
      details: error.toString(),
    });
  }
};


module.exports = {
  client,
  initializeWhatsAppClient,
  getQrCode,
  sendMessage,
  getStatus,
  logoutClient,
};
