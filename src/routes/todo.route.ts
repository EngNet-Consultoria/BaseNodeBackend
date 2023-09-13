import { Router } from "express";
import { list, create, retrieve, update, destroy } from "../controllers/todo.controller";

const router = Router();

router.get("/", list);
router.get("/:id", retrieve);
router.post("/", create);
router.put("/:id", update);
router.delete("/:id", destroy);

export default router;
