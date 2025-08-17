const express = require("express");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");

const app = express();
app.use(bodyParser.json());

// Initialize Firebase Admin SDK
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.post("/create-user", async (req, res) => {
  try {
    const { email, password, displayName } = req.body;

    const user = await admin.auth().createUser({
      email,
      password,
      displayName,
    });

    // Fetch latest user record to ensure email is included
    const userRecord = await admin.auth().getUser(user.uid);

    res.status(201).json({
      message: "User created successfully",
      uid: userRecord.uid,
      email: userRecord.email,  // ✅ will always have email
      displayName: userRecord.displayName,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
