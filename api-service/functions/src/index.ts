import * as functions from "firebase-functions/v1";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
// import {initializeApp} from "firebase-admin";
// import {Firestore} from "firebase-admin/firestore";
import { onCall } from "firebase-functions/v2/https";

admin.initializeApp();

const firestore = admin.firestore();
const storage = admin.storage();
const rawVideoBucketName = "bnw-raw-videos";

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

export const generateUploadUrl = onCall({maxInstances: 1}, async (request) => {
    // Check if the user's authenticated
    if (!request.auth) {
        throw new functions.https.HttpsError (
            "failed-precondition",
            "The function must be called while authenticated."
        );
    }

    const auth = request.auth;
    const data = request.data;
    const bucket = storage.bucket(rawVideoBucketName);

    // Generate a unique file name
    const fileName = `${auth.uid}-${Date.now()}-${data.fileExtension}`;

    // Get a v4 signed URL for uploading file
    const [url] = await bucket.file(fileName).getSignedUrl({
        version: "v4",
        action: "write",
        expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    });

    return {url, fileName};
});
