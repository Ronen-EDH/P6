const multer = require("multer");

const MIME_TYPE = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "assets");
  },
  filename: (req, file, cb) => {
    const name = file.originalname
      .split(" ")
      .join("_")
      .split(/.(?=[^.]+$)/)[0];
    const extension = MIME_TYPE[file.mimetype];
    cb(null, name + Date.now() + "." + extension);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const extension = MIME_TYPE[file.mimetype];
    if (!extension) {
      req.fileValidationError = "Fileupload error, invalid file extension";
      // I don't think this part, I mean the new Error runs, or just not sure where...
      return cb(null, false, new Error("Fileupload error, invalid file extension"));
    }
    cb(null, true);
  },
}).single("image");

module.exports = upload;
