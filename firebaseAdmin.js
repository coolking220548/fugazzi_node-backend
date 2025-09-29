import admin from "firebase-admin";
import fs from "fs";
import 'dotenv/config';

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  }),
});

export const verifyFirebaseToken = async (token) => {
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    return decoded; // Contains uid, email, etc.
  } catch (err) {
    console.error("Token verification error:", err.message);
    throw new Error("Invalid token");
  }
};
