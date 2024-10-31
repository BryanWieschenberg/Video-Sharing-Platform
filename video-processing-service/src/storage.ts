// 1. GCS file interactions
// 2. Local file interactions

import { Storage } from '@google-cloud/storage';
import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';

const storage = new Storage();
const rawVideoBucketName = "bnw-raw-videos";
const processedVideoBucketName = "bnw-processed-videos";
const localRawVideoPath = "./raw-videos";
const localProcessedVideoPath = "./processed-videos";

/**
 * Creates the local directories for raw and processed videos.
 */
export function setupDirectories() { // 17:27
    ensureDirectoryExistence(localRawVideoPath);
    ensureDirectoryExistence(localProcessedVideoPath);
}

/**
 * @param rawVideoName - The name of the file to convert from {@link localRawVideoPath},
 * @param processedVideoName - The name of the file to convert to {@link localProcessedVideoPath},
 * @returns A promise that resolves when the video's been converted
 */
export function convertVideo(rawVideoName: string, processedVideoName: string) {
    return new Promise<void>((resolve, reject) => {
        ffmpeg(`${localRawVideoPath}/${rawVideoName}`)
        .outputOptions("-vf", "scale=-1:360") // 360p resolution
        .on("end", () => {
            console.log("Video processing finished successfully.");
            resolve();
        })
        .on("error", (err) => {
            console.log(`An error occurred: ${err.message}`);
            reject(err);
        })
        .save(`${localProcessedVideoPath}/${processedVideoName}`);
    });
}

/**
 * @param fileName - File name from the downloaded
 * {@link rawVideoBucketName} bucket into the {@link localRawVideoPath} folder
 * @returns A promise that resolves when the file's been downloaded
 */
// export async function downloadRawVideo(fileName: string) {
//     await storage.bucket(rawVideoBucketName)
//         .file(fileName)
//         .download({destination: `${localRawVideoPath}/${fileName}`});
//     console.log(
//         `gs://${rawVideoBucketName}/${fileName} downloaded to ${localRawVideoPath}/${fileName}.`
//     )
// }

export async function downloadRawVideo(fileName: string) {
    const file = storage.bucket(rawVideoBucketName).file(fileName);
    const [exists] = await file.exists();
    
    if (!exists) {
        console.log(`File gs://${rawVideoBucketName}/${fileName} does not exist.`);
        return; // Skip downloading if the file doesn't exist
    }

    await file.download({destination: `${localRawVideoPath}/${fileName}`});
    console.log(`gs://${rawVideoBucketName}/${fileName} downloaded to ${localRawVideoPath}/${fileName}.`);
}

/**
 * @param fileName - File name to upload from the
 * {@link localProcessedVideoPath} bucket into the {@link processedVideoBucketName} folder
 * @returns A promise that resolves when the file's been uploaded
 */
export async function uploadProcessedVideo(fileName: string) {
    const bucket = storage.bucket(processedVideoBucketName);
    await bucket.upload(`${localProcessedVideoPath}/${fileName}`, {
        destination: fileName
    });
    console.log(
        `${localProcessedVideoPath}/${fileName} uploaded to gs://${processedVideoBucketName}/${fileName}.`
    );
    await bucket.file(fileName).makePublic();
}

/**
 * @param fileName - Name of the file to delete from the
 * {@link localRawVideoPath} folder
 * @returns A promise that resolves when the file's been deleted
 */
export function deleteRawVideo(fileName: string): Promise<void> {
    return deleteFile(`${localRawVideoPath}/${fileName}`);
}

/**
 * @param fileName - Name of the file to delete from the
 * {@link localProcessedVideoPath} folder
 * @returns A promise that resolves when the file's been deleted
 */
export function deleteProcessedVideo(fileName: string) {
    return deleteFile(`${localProcessedVideoPath}/${fileName}`);
}

/**
 * @param filePath - Path of the file to delete
 * @returns A promise that resolves when the file's been deleted
 */
function deleteFile(filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        // if (!fs.existsSync(filePath)) {
        //     // reject(`File ${filePath} does not exist.`);
        //     fs.unlink(filePath, (err) => {
        //         if (err) {
        //             console.log(`Failed to delete file at ${filePath}`, err);
        //             reject(err);
        //         } else {
        //             console.log(`File deleted at ${filePath}`);
        //             resolve();
        //         }
        //     })
        // } else {
        //     console.log(`File not found at ${filePath}, skipping the delete.`);
        //     resolve();
        // }
        if (!fs.existsSync(filePath)) {
            console.log(`File not found at ${filePath}, skipping the delete.`);
            resolve(); // Resolve even if the file doesn't exist
        } else {
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.log(`Failed to delete file at ${filePath}`, err);
                    reject(err);
                } else {
                    console.log(`File deleted at ${filePath}`);
                    resolve();
                }
            });
        }
    });
}

/**
 * Ensures a directory exists, creating it if necessary
 * @param {string} dirPath - The directroy path to check
 */
function ensureDirectoryExistence(dirPath: string) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, {recursive: true}); // Recursive: True enables creating nested directories
        console.log(`Directory created at ${dirPath}`);
    }
}
