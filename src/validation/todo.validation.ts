import * as v from 'valibot';

export const CreateTodoSchema = v.object({
  content: v.pipe(
    v.string(),
    v.minLength(1, 'El contenido no puede estar vacío'),
    v.maxLength(500, 'El contenido no puede exceder 500 caracteres')
  ),
});

export type CreateTodoInput = v.InferOutput<typeof CreateTodoSchema>;

export const UpdateTodoStatusSchema = v.object({
  id: v.pipe(v.string(), v.minLength(1)),
  status: v.picklist(['pendiente', 'haciendo', 'hecho']),
});

export type UpdateTodoStatusInput = v.InferOutput<typeof UpdateTodoStatusSchema>;

export const UpdateTodoContentSchema = v.object({
  id: v.pipe(v.string(), v.minLength(1)),
  content: v.pipe(
    v.string(),
    v.minLength(1, 'El contenido no puede estar vacío'),
    v.maxLength(500, 'El contenido no puede exceder 500 caracteres')
  ),
});

export type UpdateTodoContentInput = v.InferOutput<typeof UpdateTodoContentSchema>;

export const DeleteTodoSchema = v.object({
  id: v.pipe(v.string(), v.minLength(1)),
});

export type DeleteTodoInput = v.InferOutput<typeof DeleteTodoSchema>;
