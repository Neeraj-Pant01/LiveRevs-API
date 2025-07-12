const multer = require('multer');
const path = require('path');
// const uploads = require("../uploads")

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log('in the uploads')
    cb(null, '../uploads');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = Date.now() + '-' + file.originalname;
    console.log('name',name)
    cb(null, name);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only jpeg, png and webp files are allowed!'));
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB max
  },
  fileFilter
});

module.exports = upload;
