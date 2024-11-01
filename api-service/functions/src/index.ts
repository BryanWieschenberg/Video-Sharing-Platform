import * as functions from "firebase-functions/v1";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
// import {initializeApp} from "firebase-admin";
// import {Firestore} from "firebase-admin/firestore";

admin.initializeApp();

const firestore = admin.firestore();

export const createUser = functions.region("us-west1").auth.user().onCreate((user) => {
  const userInfo = {
    uid: user.uid,
    email: user.email,
    photoUrl: user.photoURL,
  };
  firestore.collection("users").doc(user.uid).set(userInfo);
  logger.info(`User created: ${JSON.stringify(userInfo)}`);
  return Promise.resolve();
});
