import { type TodoItem, TodoCreateSchema } from "../schemas/todo.schema";
import { prisma } from "../prisma";
import createHttpError from "http-errors";
import { z } from "zod";

export async function list(req: Req, res: Res<TodoItem[]>) {
  const todos = await prisma.todo.findMany({
    orderBy: {
      id: "asc",
    },
    select: {
      id: true,
      title: true,
      owner: {
        select: {
          name: true,
        },
      },
    },
  });

  const mappedTodos = todos.map((todo) => ({
    id: todo.id,
    title: todo.title,
    owner: todo.owner.name,
  }));

  return res.status(200).json(mappedTodos);
}

export async function retrieve(req: Req, res: Res<TodoItem>) {
  const id = z.coerce.number().int().positive().parse(req.params.id);

  const todo = await prisma.todo.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      title: true,
      owner: {
        select: {
          name: true,
        },
      },
    },
  });

  if (todo === null) {
    throw new createHttpError.NotFound("Todo not found");
  }

  return res.status(200).json({
    id: todo.id,
    title: todo.title,
    owner: todo.owner.name,
  });
}

export async function create(req: Req, res: Res<TodoItem>) {
  const validatedData = TodoCreateSchema.parse(req.body);

  const todo = await prisma.todo.create({
    data: {
      title: validatedData.title,
      owner: {
        connect: {
          id: req.userId,
        },
      },
    },
    select: {
      id: true,
      title: true,
      owner: {
        select: {
          name: true,
        },
      },
    },
  });

  return res.status(201).json({
    id: todo.id,
    title: todo.title,
    owner: todo.owner.name,
  });
}
