const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken'); // Import JWT for token verification
require('dotenv').config();

const jwtSecret = process.env.jwtSecret; // Access the secret from .env

const app = express();
app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection
mongoose.connect("mongodb+srv://pavani:pavanii@peersphere.0lh3t.mongodb.net/?retryWrites=true&w=majority&appName=peersphere&tls=true&tlsInsecure=true", {
 
});

// User Schema
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});
const User = mongoose.model('User', userSchema);

// Video Schema
const videoSchema = new mongoose.Schema({
  username: String,
  name: String,
  description: String,
  videoPath: String, // Path to the uploaded video file
  uploadDate: { type: Date, default: Date.now }, // Optional: Track upload time
});
const Video = mongoose.model('Video', videoSchema);

// Multer Configuration for File Uploads
const storage = multer.diskStorage({
  destination: './uploads/', // Directory to save uploaded files
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
  },
});
const upload = multer({ storage });

// Signup Route
app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });

  try {
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Error registering user' });
  }
});

// Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    // Generate JWT token
    const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token });
  } else {
    res.status(400).json({ error: 'Invalid credentials' });
  }
});

// Upload Video Route
app.post('/upload', upload.single('video'), async (req, res) => {
  const { username, name, description } = req.body;

  // Ensure the file is uploaded
  if (!req.file) {
    return res.status(400).json({ error: 'Video file is required' });
  }

  const videoPath = req.file.path; // Path to the uploaded video

  // Save video metadata in the database
  const newVideo = new Video({
    username,
    name,
    description,
    videoPath,
  });

  try {
    await newVideo.save();
    res.status(201).json({ message: 'Video uploaded successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error saving video data' });
  }
});

// Serve Uploaded Videos
app.use('/uploads', express.static('uploads')); // Serve videos statically

// Profile Route
app.get('/profile', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decodedToken = jwt.verify(token, jwtSecret);
    const user = await User.findById(decodedToken.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const videos = await Video.find({ username: user.username });
    res.status(200).json({ user, videos });
  } catch (error) {
    console.error('Error fetching profile details:', error);
    res.status(500).json({ error: 'Error fetching profile details' });
  }
});


// Start the Server
app.listen(5000, () => console.log('Server running on port 5000'));

// MongoDB Connection
