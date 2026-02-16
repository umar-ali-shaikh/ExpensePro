import multer from "multer"
import path from "path"

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/")
    },
    filename: function (req, file, cb) {
        cb(
            null,
            Date.now() + "-" + file.originalname
        )
    }
})

const fileFilter = (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"]
    if (allowed.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(new Error("Only images allowed"), false)
    }
}

const upload = multer({
    storage,
    fileFilter
})

export default upload