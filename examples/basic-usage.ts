import { z } from "zod";
import { createSafeAction } from "../src";

// 1. Defining the schema for input validation
const UpdateUserSchema = z.object({
  id: z.string(),
  name: z.string().min(3, "Name should be at least 3 characters long"),
});

// 2. Aksiyonunu oluştur
export const updateUser = createSafeAction(UpdateUserSchema, async (data) => {
  // Make database update here using validated data
  // Ex: await db.user.update({ where: { id: data.id }, data: { name: data.name } });
  return { success: true, updatedName: data.name };
});

// 3. Usage (Frontend)
/*
  const res = await updateUser({ id: "1", name: "Al" });
  if (res.validationErrors) {
     console.log(res.validationErrors.name); // ["Name should be at least 3 characters long"]
  }
*/