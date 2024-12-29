const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

// Directory to save uploaded files
const UPLOAD_DIR = path.join(__dirname, "..", "uploads");

// Ensure the upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR);
}

const imageupload = async (file) => {
  try {
    console.log("file", file);

    // Generate a unique file name
    const uniqueFileName = `${uuidv4()}-${file.originalname}`;
    const filePath = path.join(UPLOAD_DIR, uniqueFileName);

    // Write the file buffer to the local file system
    fs.writeFileSync(filePath, file.buffer);

    // Construct a public URL for the file
    const imageUrl = `http://localhost:5000/uploads/${uniqueFileName}`;
    console.log("imageUrl", imageUrl);

    return imageUrl;
  } catch (error) {
    console.error("Error while uploading file:", error);
    return ""; // Return an empty string in case of an error
  }
};

module.exports = imageupload;
