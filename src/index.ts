import { z } from "zod";

// Generic return type for action responses
export type ActionResponse<T> = {
  data?: T;
  error?: string | null;
  validationErrors?: Record<string, string[]>;
  metadata?: {
    duration: number;
  };
};

/**
 * createSafeAction: Wrapping function that combines Zod validation with a handler function.
 * It ensures that the input data is validated before processing and provides a consistent
 * response structure.
 */
export function createSafeAction<Schema extends z.ZodTypeAny, T>(
  schema: Schema,
  handler: (data: z.infer<Schema>) => Promise<T>,
) {
  return async (input: unknown): Promise<ActionResponse<T>> => {
    const start = Date.now();
    // 1. Validation step
    const result = schema.safeParse(input);

    if (!result.success) {
      return {
        error: "Validation failed.",
        validationErrors: result.error.flatten().fieldErrors as Record<
          string,
          string[]
        >,
      };
    }

    // 2. Processing step
    try {
      const data = await handler(result.data);
      const duration = Date.now() - start;
      if (process.env.NODE_ENV === "development") {
        console.log(`[ACTION LOG]: Success in ${duration}ms`);
      }
      return { data, error: null, metadata: { duration } };
    } catch (e:unknown) {
      const duration = Date.now() - start;
      console.error("[ACTION_ERROR]:", e);
      return {
        error: e instanceof Error ? e.message : "An unexpected error occurred.",
        metadata: { duration }
      };
    }
  };
}