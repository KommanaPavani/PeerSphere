const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = 5000;
const jwtSecret = process.env.JWT_SECRET;
const mongoURI = process.env.MONGO_URI;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB Atlas connected'))
  .catch((err) => console.error(' MongoDB connection error:', err));

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
  imagePath: String,
  videoPath: String,
  uploadDate: { type: Date, default: Date.now },
});
const Video = mongoose.model('Video', videoSchema);

// Multer setup
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });
const uploadFields = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'video', maxCount: 1 },
]);

// Signup route
// Signup route
app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json({ error: 'Email already in use' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);  // Log the full error for debugging purposes
    res.status(500).json({ error: `Error registering user: ${err.message}` });
  }
});
// Get a single video by ID
app.get('/videos/:videoId', async (req, res) => {
  try {
    const video = await Video.findById(req.params.videoId);
    console.log('Requested video ID:', req.params.videoId);
    console.log('Fetched video:', video);
    if (!video) return res.status(404).json({ error: 'Video not found' });
    res.status(200).json({ video });
  } catch (err) {
    console.error('Fetch video error:', err);
    res.status(500).json({ error: 'Failed to fetch video' });
  }
});


// Login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ error: 'Login error' });
  }
});

// Upload route
app.post('/upload', uploadFields, async (req, res) => {
  const { name, description } = req.body;
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, jwtSecret);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const image = req.files['image']?.[0];
    if (!image) return res.status(400).json({ error: 'Image is required' });

    const video = req.files['video']?.[0];

    const newVideo = new Video({
      username: user.username,
      name,
      description,
      imagePath: path.join('uploads', image.filename),
      videoPath: video ? path.join('uploads', video.filename) : null,
    });

    await newVideo.save();
    res.status(201).json({ message: 'Course uploaded successfully' });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Serve uploaded media
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Get user profile and videos
app.get('/profile', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, jwtSecret);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const videos = await Video.find({ username: user.username });
    res.status(200).json({ user, videos });
  } catch (err) {
    console.error('Profile fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Get all videos (public)
app.get('/videos', async (req, res) => {
  try {
    const videos = await Video.find();
    res.status(200).json({ videos });
  } catch (err) {
    console.error('Fetch videos error:', err);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
