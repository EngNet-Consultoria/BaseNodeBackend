import { mysqlConn } from "../mysql";
import { DatabaseError } from "../schemas/error.schema";
import { type TodoItem } from "../schemas/todo.schema";

export async function findAllTodo(): Promise<TodoItem[]> {
  const result = await mysqlConn.query("SELECT id, title FROM todo");

  return result.map((row) => ({
    id: row.id,
    title: row.title,
  }));
}

export async function findTodoById(id: number): Promise<TodoItem | null> {
  try {
    const result = await mysqlConn.query("SELECT id, title FROM todo WHERE id = ?", [id]);

    if (result.length === 0) return null;

    return {
      id: result[0]!.id,
      title: result[0]!.title,
    };
  } catch (err) {
    throw DatabaseError.fromError(err);
  }
}

export async function createTodo(title: string): Promise<TodoItem> {
  try {
    const insertResult = await mysqlConn.execute("INSERT INTO todo (title) VALUES (?)", [title]);

    const selectResult = await findTodoById(insertResult.insertId);

    return {
      id: selectResult!.id,
      title: selectResult!.title,
    };
  } catch (err) {
    throw DatabaseError.fromError(err);
  }
}

export async function updateTodoById(id: number, title: string): Promise<TodoItem | null> {
  try {
    const updateResult = await mysqlConn.execute("UPDATE todo SET title = ? WHERE id = ?", [title, id]);

    if (updateResult.affectedRows === 0) return null;

    const selectResult = await findTodoById(id);

    return {
      id: selectResult!.id,
      title: selectResult!.title,
    };
  } catch (err) {
    throw DatabaseError.fromError(err);
  }
}

export async function deleteTodoById(id: number): Promise<void> {
  try {
    await mysqlConn.execute("DELETE FROM todo WHERE id = ?", [id]);
  } catch (err) {
    throw DatabaseError.fromError(err);
  }
}