import { Router } from "express";
import createHttpError from "http-errors";
import { TodoCreateSchema, TodoIdSchema } from "../schemas/todo.schema";
import { prisma } from "../prisma";

const router = Router();

router.get("/", async (req, res) => {
  // Validate input
  // Execute business logic
  const todos = await prisma.todo.findMany({
    orderBy: {
      id: "asc",
    },
    select: {
      id: true,
      title: true,
    },
  });

  // Send response
  return res.status(200).json(todos);
});

router.get("/:id", async (req, res) => {
  // Validate input
  const id = TodoIdSchema.parse(req.params.id);

  // Execute business logic
  const todo = await prisma.todo.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      title: true,
    },
  });

  if (todo === null) {
    throw new createHttpError.NotFound("Todo not found");
  }

  // Send response
  return res.status(200).json(todo);
});

router.post("/", async (req, res) => {
  // Validate input
  const { title } = TodoCreateSchema.parse(req.body);

  // Execute business logic
  const todo = await prisma.todo.create({
    data: {
      title,
    },
    select: {
      id: true,
      title: true,
    },
  });

  // Send response
  return res.status(201).json(todo);
});

router.put("/:id", async (req, res) => {
  // Validate input
  const id = TodoIdSchema.parse(req.params.id);
  const { title } = TodoCreateSchema.parse(req.body);

  // Execute business logic
  const todo = await prisma.todo.update({
    where: {
      id,
    },
    data: {
      title,
    },
    select: {
      id: true,
      title: true,
    },
  });

  // Send response
  return res.status(200).json(todo);
});

router.delete("/:id", async (req, res) => {
  // Validate input
  const id = TodoIdSchema.parse(req.params.id);

  // Execute business logic
  await prisma.todo.delete({
    where: {
      id,
    },
  });

  // Send response
  return res.status(204).json();
});

export default router;
