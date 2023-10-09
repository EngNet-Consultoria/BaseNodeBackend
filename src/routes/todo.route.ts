import { Router } from "express";
import createHttpError from "http-errors";
import { TodoCreateSchema, TodoIdSchema } from "../schemas/todo.schema";
import { prisma } from "../prisma";

const router = Router();

router.get("/", async (req, res) => {
  // Validate input
  const { userId } = req;

  if (userId === undefined) {
    throw new createHttpError.Unauthorized("Usuário não autenticado");
  }

  // Execute business logic
  const todos = await prisma.todo.findMany({
    where: {
      userId,
    },
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
  const { userId } = req;

  if (userId === undefined) {
    throw new createHttpError.Unauthorized("Usuário não autenticado");
  }

  // Execute business logic
  const todo = await prisma.todo.findFirst({
    where: {
      id,
      userId,
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
  const { userId } = req;

  if (userId === undefined) {
    throw new createHttpError.Unauthorized("Usuário não autenticado");
  }

  // Execute business logic
  const todo = await prisma.todo.create({
    data: {
      title,
      user: {
        connect: {
          id: userId,
        },
      },
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
  const { userId } = req;

  if (userId === undefined) {
    throw new createHttpError.Unauthorized("Usuário não autenticado");
  }

  // Execute business logic
  const todo = await prisma.todo.update({
    where: {
      id,
      userId,
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
  const { userId } = req;

  if (userId === undefined) {
    throw new createHttpError.Unauthorized("Usuário não autenticado");
  }

  // Execute business logic
  await prisma.todo.delete({
    where: {
      id,
      userId,
    },
  });

  // Send response
  return res.status(204).json();
});

export default router;
