import express from "express";
import ffmpeg from "fluent-ffmpeg";
import { convertVideo, deleteProcessedVideo, deleteRawVideo, downloadRawVideo, setupDirectories, uploadProcessedVideo } from "./storage";
import { isVideoNew, setVideo } from "./firestore";

setupDirectories();
const app = express();
app.use(express.json());

app.post("/process-video", async (req, res, next) => {
    try {
        await processVideoHandler(req, res);
        next();
    } catch (err) {
        next(err);
    }    
});

async function processVideoHandler(req: express.Request, res: express.Response) {
    // Get bucket and filename from Cloud Pub/Sub msg
    let data;
    try {
        const msg = Buffer.from(req.body.message.data, 'base64').toString('utf8');
        data = JSON.parse(msg);
        if (!data.name) {
            throw new Error('Invalid message payload received.');
        }
    } catch (error) {
        console.error(error);
        return res.status(400).send('Bad request: Missing filename.');
    }

    const inputFileName = data.name; // Format of <UID>-<DATE>.<EXTENSION>
    const outputFileName = `processed-${inputFileName}`;
    const videoId = inputFileName.split('-')[0];

    if (!isVideoNew(videoId)) {
        return res.status(400).send('Bad request: Video already processed.');
    } else {
        await setVideo(videoId, {
            id: videoId,
            uid: videoId.split('-')[0],
            status: 'processing'
        });
    }

    // Download raw video from Cloud Storage
    await downloadRawVideo(inputFileName);
    
    // Convert video to 360p
    try {
        await convertVideo(inputFileName, outputFileName);
    } catch (err) {
        await Promise.all([
            deleteRawVideo(inputFileName),
            deleteProcessedVideo(outputFileName)
        ]);
        console.log(err);
        return res.status(500).send('Internal Server Error: Video processing failed.');
    }

    // Upload processed video to Cloud Storage
    await uploadProcessedVideo(outputFileName);

    await setVideo(videoId, {
        status: 'processed',
        filename: outputFileName,
    });

    await Promise.all([
        deleteRawVideo(inputFileName),
        deleteProcessedVideo(outputFileName)
    ]);

    return res.status(200).send('Processing finished successfully.');
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(
        `Video processing service listening at http://localhost:${port}`
    );
});
