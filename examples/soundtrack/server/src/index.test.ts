import request from "supertest";
import app from "./index"; // import your app

describe("POST /upload", () => {
  it("should return 400 if no file is uploaded", async () => {
    const res = await request(app).post("/upload").field("objectId", "123");

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("error", "No file uploaded");
  });

  it("should return 400 if file size exceeds 50MB", async () => {
    const file = Buffer.alloc(51 * 1024 * 1024); // create a file larger than 50MB

    const res = await request(app)
      .post("/upload")
      .attach("file", file, "test.jpg")
      .field("objectId", "123");

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("error", "File size exceeds 50MB");
  });

  // Assuming successful upload returns 200 status
  it("should return 200 if file is uploaded successfully", async () => {
    const file = Buffer.alloc(1 * 1024 * 1024); // create a 1MB file

    const res = await request(app)
      .post("/upload")
      .attach("file", file, "test.jpg")
      .field("objectId", "123");

    expect(res.statusCode).toEqual(200);
  });
});

describe("GET /files/:objectId", () => {
  // Assuming successful retrieval returns 200 status
  it("should return 200 if files are retrieved successfully", async () => {
    const res = await request(app).get("/files/123");

    expect(res.statusCode).toEqual(200);
  });

  // Add more tests as needed
});
