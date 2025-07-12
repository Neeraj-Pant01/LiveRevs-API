const express = require("express");
const cors = require('cors')
const dotenv = require("dotenv").config();
const helmet = require("helmet");
const connectDb = require("./config/db");
const compression = require('compression')
const swaggerUi = require('swagger-ui-express')
const swagerSpec = require("./swagger/swagger")
const authRoute = require("./routes/auth.route")
const userRoute = require("./routes/user.route")
const profileRoute = require("./routes/profile.route");
const reviewRoute = require("./routes/review.route")
const commentRoute = require("./routes/comment.route");

const app = express();

app.use(helmet())
app.use(cors())
app.use(express.json());

const multer = require("multer");
const path = require("path");
const { verifyToken } = require("./middlewares/verifyToken");

// const uploads = require("../uploads")


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const name = Date.now() + '-' + file.originalname
        cb(null, name)
    }
})

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp']
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(new Error('only jpeg, png and webp images are allowed'))
    }
}

const upload = multer({
    storage,
    limits: {
        fileSize: 2 * 1024 * 1024
    },
    fileFilter
})

const mongoSanitizeMiddleware = (req, res, next) => {
    const sanitize = (obj) => {
        if (typeof obj !== 'object' || obj === null) return;
        for (const key of Object.keys(obj)) {
            if (typeof key === 'string' && (key.includes('$') || key.includes('.'))) {
                delete obj[key];
            } else {
                sanitize(obj[key]);
            }
        }
    };

    if (req.body) sanitize(req.body);
    if (req.query) sanitize(req.query);
    if (req.params) sanitize(req.params);
    next();
};


app.use(mongoSanitizeMiddleware);
app.use(compression())


app.use((err, req, res, next) => {
    errStatus = err.status || 500
    errMesage = err.message || 'internal server error!'
    return res.status(errStatus).json(errMesage)
})

//upload image
app.post('/api/v1/upload',verifyToken, upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(200).json({ message: "upload image to process !" })
    }
    const filepath = `/uploads/${req.file.filename}`;
    res.status(200).json({
        message: "upload successfull ",
        fileUrl: filepath
    })
})

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swagerSpec))
app.use('/api/v1/auth', authRoute)
app.use('/api/v1/user', userRoute)
app.use('/api/v1/profile', profileRoute)
app.use('/api/v1/review',reviewRoute)
app.use('/api/v1/comments', commentRoute)


const PORT = 9000 || process.env.PORT


app.listen(PORT, () => {
    connectDb()
    console.log(`server is running at the port ${PORT}`)
})