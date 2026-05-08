const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: 'storage/entrada',

  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;

    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,

  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);

    if (!['.xlsx', '.xls'].includes(ext)) {
      return cb(new Error('Arquivo inválido'));
    }

    cb(null, true);
  }
});

module.exports = upload;