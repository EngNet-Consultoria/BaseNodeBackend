import { Router } from "express";
import { list, create, retrieve, update, destroy } from "../business/todo.business";
import createHttpError from "http-errors";
import { TodoCreateSchema, TodoIdSchema } from "../schemas/todo.schema";

const router = Router();

router.get("/", async (req, res) => {
  // Validate input
  const { userId } = req;

  if (userId === undefined) {
    throw new createHttpError.Unauthorized("Usuário não autenticado");
  }

  // Execute business logic
  const todos = await list(userId);

  // Send response
  return res.status(200).json(todos);
});

router.get("/:id", async (req, res) => {
  // Validate input
  const id = TodoIdSchema.parse(req.params.id);
  const { userId } = req;

  if (userId === undefined) {
    throw new createHttpError.Unauthorized("Usuário não autenticado");
  }

  // Execute business logic
  const todo = await retrieve(id, userId);

  // Send response
  return res.status(200).json(todo);
});

router.post("/", async (req, res) => {
  // Validate input
  const input = TodoCreateSchema.parse(req.body);
  const { userId } = req;

  if (userId === undefined) {
    throw new createHttpError.Unauthorized("Usuário não autenticado");
  }

  // Execute business logic
  const todo = await create(input, userId);

  // Send response
  return res.status(201).json(todo);
});

router.put("/:id", async (req, res) => {
  // Validate input
  const id = TodoIdSchema.parse(req.params.id);
  const input = TodoCreateSchema.parse(req.body);
  const { userId } = req;

  if (userId === undefined) {
    throw new createHttpError.Unauthorized("Usuário não autenticado");
  }

  // Execute business logic
  const todo = await update(id, input, userId);

  // Send response
  return res.status(200).json(todo);
});

router.delete("/:id", async (req, res) => {
  // Validate input
  const id = TodoIdSchema.parse(req.params.id);
  const { userId } = req;

  if (userId === undefined) {
    throw new createHttpError.Unauthorized("Usuário não autenticado");
  }

  // Execute business logic
  await destroy(id, userId);

  // Send response
  return res.status(204).json();
});

export default router;
