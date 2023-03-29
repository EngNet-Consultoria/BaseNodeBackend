import { type TodoItem, TodoCreateSchema } from "../schemas/todo.schema";
import { prisma } from "../prisma";

export async function list(req: Req, res: Res<TodoItem[]>) {
  const todos = await prisma.todo.findMany({
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

export async function create(req: Req, res: Res<TodoItem>) {
  const validatedData = TodoCreateSchema.parse(req.body);

  const todo = await prisma.todo.create({
    data: {
      title: validatedData.title,
    },
  });

  return res.status(201).json(todo);
}
