import express from "express"
import cors from "cors"
import { v2 as cloudinary } from 'cloudinary'; // Proper import
import dotenv from 'dotenv';

dotenv.config()

/*console.log("Environment Variables:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? "***" : "missing",
  api_key: process.env.CLOUDINARY_API_KEY ? "***" : "missing",
  api_secret: process.env.CLOUDINARY_API_SECRET ? "***" : "missing"
});*/

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

/*console.log("Cloudinary Config:", {
  cloud: cloudinary.config().cloud_name,
  apiKey: cloudinary.config().api_key ? "***configured***" : "missing"
});*/

const app = express()
app.use(cors())
app.use(express.json())

//app.get('/', (req, resp) => resp.send('Hunix'));

app.delete('/api/delete-image', async (req, res) => {
  try {
    const { publicId } = req.body;
    
    if (!publicId) {
      console.log("Missing publicId in request");
      return res.status(400).json({ success: false, message: 'Public ID is required' });
    }

    console.log(`Attempting to delete: ${publicId}`);
    const result = await cloudinary.uploader.destroy(publicId);
    console.log("Cloudinary deletion result:", result); // Critical debug line
    
    if (result.result === 'ok') {
      console.log("Deletion successful");
      return res.json({ success: true, message: 'Image deleted successfully' });
    } else {
      console.log("Deletion failed with result:", result);
      return res.status(400).json({ 
        success: false, 
        message: 'Failed to delete image', 
        details: result 
      });
    }
  } catch (error) {
    console.error('Full deletion error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
});

const port = process.env.PORT || 3000
app.listen(port, () => console.log("Server listening on port: " + port ))