import { getFunctions, httpsCallable } from "firebase/functions";
import { initializeApp } from "firebase/app";

// The web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC0DOQLQMlGaxlRQDgOl9iFXq245NWDMSo",
    authDomain: "video-processing-service-c3494.firebaseapp.com",
    projectId: "video-processing-service-c3494",
    appId: "1:464021412586:web:303965aad1ba1f697d1593",
    measurementId: "G-42K8YX54P9"
  };
  
const app = initializeApp(firebaseConfig); // Initialize Firebase app
const functions = getFunctions(app);
const generateUploadUrl = httpsCallable(functions, "generateUploadUrl");
const getVideosFunction = httpsCallable(functions, "getVideos");

export interface Video {
    id?: string;
    uid?: string,
    filename?: string,
    status?: 'processing' | 'processed',
    title?: string,
    description?: string
}

export async function uploadVideo(file: File) {
    const response: any = await generateUploadUrl({
        fileExtension: file.name.split('.').pop()
    });

    // Upload the file via the signed URL
    await fetch(response?.data?.url, {
        method: "PUT",
        body: file,
        headers: {
            "Content-Type": file.type
        }
    });

    return;
}

export async function getVideos() {
    const response = await getVideosFunction();
    return response.data as Video[];
}
