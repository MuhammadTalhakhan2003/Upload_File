const path = require('path');
const express = require('express');
const multer = require('multer');
const fs = require('fs');

const app = express();
const PORT = 8000;

// Ensure the uploads directory exists
const uploadDir = path.resolve(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads'); // Uploads folder
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`); // Unique file name
    },
});

const upload = multer({ storage });

// Set View Engine
app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.get('/', (req, res) => {
    return res.render('home.ejs');
});

app.post('/upload', upload.fields([{ name: 'profileImage' }, { name: 'coverImage' }]), (req, res) => {
    console.log(req.body);
    console.log(req.files); // Corrected from req.file to req.files
    return res.redirect('/');
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
