import { Router } from "express";
import { list, create, retrieve } from "../controllers/todo.controller";

const router = Router();

router.get("/", list);
router.get("/:id", retrieve);
router.post("/", create);

export default router;
