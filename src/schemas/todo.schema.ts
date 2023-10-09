import { z } from "zod";

export interface TodoItem {
  id: number;
  title: string;
}

export const TodoCreateSchema = z.object({
  title: z.string().max(50),
});

export type TodoCreateDTO = z.infer<typeof TodoCreateSchema>;

export const TodoIdSchema = z.coerce.number().int().positive();
