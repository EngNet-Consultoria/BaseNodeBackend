import { type TodoItem, TodoCreateSchema } from "../schemas/todo.schema";
import { prisma } from "../prisma";
import createHttpError from "http-errors";
import { z } from "zod";
import { type Request, type Response } from "express";

export async function list(req: Request, res: Response<TodoItem[]>) {
  const { userId } = req;

  if (userId === undefined) {
    throw new createHttpError.Unauthorized("Usuário não autenticado");
  }

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

  return res.status(200).json(todos);
}

export async function retrieve(req: Request, res: Response<TodoItem>) {
  const id = z.coerce.number().int().positive().parse(req.params.id);
  const { userId } = req;

  if (userId === undefined) {
    throw new createHttpError.Unauthorized("Usuário não autenticado");
  }

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

  return res.status(200).json(todo);
}

export async function create(req: Request, res: Response<TodoItem>) {
  const { title } = TodoCreateSchema.parse(req.body);
  const { userId } = req;

  if (userId === undefined) {
    throw new createHttpError.Unauthorized("Usuário não autenticado");
  }

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

  return res.status(201).json(todo);
}

export async function update(req: Request, res: Response<TodoItem>) {
  const id = z.coerce.number().int().positive().parse(req.params.id);
  const { title } = TodoCreateSchema.parse(req.body);
  const { userId } = req;

  if (userId === undefined) {
    throw new createHttpError.Unauthorized("Usuário não autenticado");
  }

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

  return res.status(200).json(todo);
}

export async function destroy(req: Request, res: Response) {
  const id = z.coerce.number().int().positive().parse(req.params.id);
  const { userId } = req;

  if (userId === undefined) {
    throw new createHttpError.Unauthorized("Usuário não autenticado");
  }

  await prisma.todo.delete({
    where: {
      id,
      userId,
    },
  });

  return res.status(204).send();
}
