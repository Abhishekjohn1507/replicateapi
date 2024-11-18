import express from "express";
import Replicate from "replicate";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Initialize Replicate client
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

app.use(express.json()); // Middleware to parse JSON body

// POST endpoint
app.post("/generate-image", async (req, res) => {
  try {
    const data = req.body;
    if (!data?.aiModelName || !data?.inputPrompt || !data?.userImageUrl) {
      throw new Error("Missing required fields: aiModelName, inputPrompt, or userImageUrl");
    }

    const output = await replicate.run(data.aiModelName, {
      input: {
        prompt: `${data.inputPrompt} ${data.defaultPrompt || ""}`,
        main_face_image: data.userImageUrl,
        image: data.userImageUrl,
      },
    });

    res.json({ result: output?.[0] || output || "No output generated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
