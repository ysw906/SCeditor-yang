import { Router, type IRouter } from "express";
import type { RequestHandler } from "express";

const router: IRouter = Router();

const ADMIN_USERNAME = "sample";
const ADMIN_PASSWORD = "sample";

router.post("/login", (async (req, res) => {
  const { username, password } = req.body as { username: string; password: string };
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    (req.session as any).userId = username;
    (req.session as any).isAdmin = true;
    return res.json({ success: true, username, isAdmin: true });
  }
  return res.status(401).json({ error: "Invalid credentials" });
}) as RequestHandler);

router.post("/logout", (async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Logout failed" });
    }
    return res.json({ success: true, message: "Logged out successfully" });
  });
}) as RequestHandler);

router.get("/me", ((req, res) => {
  const session = req.session as any;
  if (session.userId) {
    return res.json({ username: session.userId, isAdmin: session.isAdmin || false, isLoggedIn: true });
  }
  return res.json({ username: "", isAdmin: false, isLoggedIn: false });
}) as RequestHandler);

export default router;
