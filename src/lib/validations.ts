import * as z from "zod";

export const SignupValidation = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters." })
    .max(50)
    .toLowerCase(),
  fullname: z
    .string()
    .min(3, { message: "Name must be at least 3 characters." })
    .max(50),
  email: z.string().email({ message: "Invalid email address!" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." }),
});

export const signinValidation = z.object({
  email: z.string().email({ message: "Invalid email address!" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." }),
});
