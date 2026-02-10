# Next Tiny Action 🚀

An ultra-lightweight, type-safe wrapper for Next.js Server Actions. Stop writing repetitive try-catch blocks and manual Zod validations.

## 💡Why Use It?

Next.js Server Actions are powerful, but as projects grow, several issues arise:

- Code Duplication: Writing the same try/catch logic in every action.

- Unsafe Data: Handling manual zod.safeParse checks repeatedly.

- Lack of Standards: Inconsistent error response formats across the frontend.

- Next Tiny Action solves these problems in less than 50 lines of code, without adding any heavy dependencies.

## ✨ Features

- ✅ Zero Dependencies: Uses only zod, which is likely already in your project.

- ✅ Full Type Safety: 100% TypeScript compatible with inferred types.

- ✅ Clean Syntax: A functional wrapper approach that eliminates boilerplate.

- ✅ Copy-Paste Ready: No need to install a library; just copy the utility file into your project.

## 🛠️ Installation

Since this is a minimalist utility, you can integrate it directly into your project.

Ensure Zod is installed:

npm install zod

Copy the core logic:
Copy the code from src/index.ts into a file like lib/safe-action.ts in your Next.js project.

## 🚀 Usage Example

1. Define your Schema & Action

```

// lib/actions.ts
import { z } from "zod";
import { createSafeAction } from "./safe-action";

const UpdateUserSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long"),
});

export const updateUsername = createSafeAction(UpdateUserSchema, async (data) => {
  // When you reach here, data is ALREADY validated and typed.
  // Add your DB logic here:
  // const user = await db.user.update(...)

  return { message: "Username updated!", user: data.username };
});

```

2. Use in Client Components

```

"use client";

import { updateUsername } from "./actions";

export function ProfileForm() {
const handleSubmit = async (formData: FormData) => {
// Sending form data to the action
const result = await updateUsername({
username: formData.get("username")
});

    if (result.validationErrors) {
      // Field-specific validation errors from Zod
      console.log("Validation Errors:", result.validationErrors);
    } else if (result.error) {
      // Generic server errors (e.g., database failure)
      console.error("Server Error:", result.error);
    } else {
      // Successful operation
      console.log("Success:", result.data);
    }

};

return (
<form action={handleSubmit}>
<input name="username" placeholder="Username" />
<button type="submit">Update</button>
</form>
);
}

```

## 📊 Response Structure

Every action returns a consistent object that is easy to handle on the frontend:

```
{
data?: T; // Your returned data on success
error?: string; // Generic server errors (from try-catch)
validationErrors?: Record<string, string[]>; // Zod validation errors
}

```

## 📄 License

MIT
