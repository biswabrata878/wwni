import express from "express";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

if (!getApps().length) {
  initializeApp({
    credential: cert({
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
    }),
  });
}

const app = express();
app.use(express.json());

// Example route: Create Firebase User
app.post("/createUser", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await getAuth().createUser({ email, password });
    res.json({ message: "User created", uid: user.uid });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(10000, () => {
  console.log("Server running on port 10000");
});
