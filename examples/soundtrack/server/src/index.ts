import express from "express";
import multer from "multer";
import AWS from "aws-sdk";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import path from "path";

const router = express.Router();

const tokenGuard = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }

  const [bearer, token] = authHeader.split(" ");

  if (bearer !== "Bearer" || !token) {
    return res.status(401).json({ error: "Invalid token format" });
  }

  if (token !== process.env.TOKEN_SECRET) {
    return res.status(401).json({ error: "Invalid token" });
  }

  next();
};

dotenv.config();

const app = express();
const MAX_SIZE = 1024 * 1024 * 50; // 50MB
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  dest: "soundtrack/",
  limits: { fileSize: MAX_SIZE },
});

// Configure AWS SDK
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3();

// API to accept single file upload and objectId
router.post("/upload", upload.single("file"), async (req, res) => {
  const { objectId } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  if (file.size > MAX_SIZE) {
    return res.status(400).json({ error: "File size exceeds 50MB" });
  }

  const mimeType = file.mimetype;
  if (mimeType !== "audio/mp3" && mimeType !== "audio/mpeg") {
    return res.status(400).json({ error: "Only MP3 files are allowed" });
  }

  const fileId = uuidv4();
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${objectId}/${fileId}/${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    const data = await s3.upload(params).promise();
    return res.json({
      message: "File uploaded successfully",
      data: {
        objectId: objectId,
        fileId: fileId,
        fileName: file.originalname,
        fileUrl: data.Location,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to upload file" });
  }
});

// API to return list of files related to given objectId
router.get("/files/:objectId", (req, res) => {
  const { objectId } = req.params;

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Prefix: objectId,
  };

  s3.listObjectsV2(params, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to retrieve files" });
    }
    const files = data.Contents.map((file) => {
      const urlParams = { Bucket: process.env.AWS_BUCKET_NAME, Key: file.Key };
      const url = s3.getSignedUrl("getObject", urlParams);
      const parts = file.Key.split("/");
      const fileId = parts[1]; // Extract the fileId from file.Key
      const fileName = path.basename(file.Key); // Extract the filename from file.Key

      return {
        fileId: fileId,
        fileName: fileName,
        fileUrl: url,
      };
    });
    return res.json({ files });
  });
});

// API to delete a file from S3 by objectId and file name

router.delete("/files/:objectId/:id/:name", (req, res) => {
  const { objectId, id, name } = req.params;

  const params: AWS.S3.DeleteObjectRequest = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${objectId}/${id}/${name}`,
  };
  s3.deleteObject(params, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to delete file" });
    }
    return res.json({ message: "File deleted successfully" });
  });
});

app.use("/api/v1", tokenGuard, router);
app.listen(process.env.PORT, () => {
  console.log("Server listening on port", process.env.PORT);
});

export default app;
