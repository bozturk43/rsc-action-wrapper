import { z } from "zod";

// Generic return type for action responses
export type ActionResponse<T> = {
  data?: T;
  error?: string | null;
  validationErrors?: Record<string, string[]>;
};

/**
 * createSafeAction: Wrapping function that combines Zod validation with a handler function.
 * It ensures that the input data is validated before processing and provides a consistent 
 * response structure.
 */
export function createSafeAction<Schema extends z.ZodTypeAny, T>(
  schema: Schema,
  handler: (data: z.infer<Schema>) => Promise<T>
) {
  return async (input: unknown): Promise<ActionResponse<T>> => {
    // 1. Validation step
    const result = schema.safeParse(input);

    if (!result.success) {
      return {
        error: "Validation failed.",
        validationErrors: result.error.flatten().fieldErrors as Record<string, string[]>,
      };
    }

    // 2. Processing step
    try {
      const data = await handler(result.data);
      return { data, error: null };
    } catch (e) {
      console.error("[ACTION_ERROR]:", e);
      return {
        error: e instanceof Error ? e.message : "An unexpected error occurred.",
      };
    }
  };
}