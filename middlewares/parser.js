import multer from "multer";
import dotenv from "dotenv";
dotenv.config();

const uploadloc = process.env.IMAGEUPLOADDEST;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadloc);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

export default upload;
