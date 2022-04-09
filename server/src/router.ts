import { Router } from "express";
import ping from "./actions/ping";

const router = Router();

router.get("/api/ping", ping);

export default router;
