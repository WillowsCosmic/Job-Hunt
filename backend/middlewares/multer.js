
import multer from "multer";
import path from "path";

// Create disk storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Save files to public/uploads/images directory
        cb(null, './public/uploads/images/');
    },
    filename: function (req, file, cb) {
        // Generate unique filename: timestamp-originalname
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = path.extname(file.originalname);
        const fileName = file.fieldname + '-' + uniqueSuffix + fileExtension;
        cb(null, fileName);
    }
});

// File filter for images and PDFs
const fileFilter = (req, file, cb) => {
    // Accept images only
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else if (file.mimetype === 'application/pdf') {
        // Also accept PDFs for resumes
        cb(null, true);
    } else {
        cb(new Error('Only image files (PNG, JPG, JPEG) and PDFs are allowed!'), false);
    }
};

// Configure multer
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: fileFilter
});

// Export different upload configurations
export const singleUpload = upload.single("file"); // For register route

// ✅ Add this for profile update - handles multiple files
export const multipleUpload = upload.fields([
    { name: 'file', maxCount: 1 },           // Resume file
    { name: 'profilePhoto', maxCount: 1 }    // Profile photo file
]);

// Alternative: if you want to accept any files (less specific)
export const anyUpload = upload.any();
