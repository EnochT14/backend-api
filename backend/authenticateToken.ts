import { Request, Response, NextFunction } from "express";
import admin from "firebase-admin";
import path from "path";

interface CustomRequest extends Request {
  currentUser?: admin.auth.DecodedIdToken;
}

const firebaseServiceAccountPath = path.join(
  __dirname,
  "../firebaseServiceAccount.json"
);

const firebaseServiceAccount = require(firebaseServiceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(firebaseServiceAccount),
  databaseURL: "https://verge-35247.firebaseio.com",
});

async function decodeIDToken(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  const header = req.headers.authorization;
  if (
    header !== "Bearer null" &&
    req.headers.authorization?.startsWith("Bearer ")
  ) {
    const idToken = req.headers.authorization.split("Bearer ")[1];

    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      req["currentUser"] = decodedToken;
    } catch (error) {
      console.log("Error in decodeIDToken(): ", error);
    }
  }
  next();
}

export default decodeIDToken;
