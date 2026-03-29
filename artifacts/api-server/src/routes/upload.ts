import { Router, type IRouter } from "express";
import type { RequestHandler } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const router: IRouter = Router();

function requireAdmin(req: any, res: any, next: any) {
  const session = req.session as any;
  if (!session.userId || !session.isAdmin) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  return next();
}

const uploadDir = path.resolve(process.cwd(), "../portfolio/public/images");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9가-힣_-]/g, "_")
      .slice(0, 60);
    const unique = `${Date.now()}_${base}${ext}`;
    cb(null, unique);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/svg+xml", "image/gif"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

router.post("/", requireAdmin, upload.single("file"), ((req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  const url = `/images/${req.file.filename}`;
  return res.json({ url, filename: req.file.filename, originalName: req.file.originalname });
}) as RequestHandler);

export default router;
