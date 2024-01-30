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

export const postFormValidation = z.object({
  caption: z
    .string()
    .min(1, { message: "Caption must be at least 1 character." })
    .max(30)
    .trim(),
  media: z.custom<File[]>(),
  location: z.string().min(2).max(20).trim(),
  tags: z.string().toLowerCase(),
});

export const postCommentValidation = z.object({
  comment: z.string().min(1, { message: "Comment cannot be empty!" }).max(220),
});

export const editProfileValidation = z.object({
  profilePicture: z.union([z.custom<File[]>(), z.string()]), // Allow file or string
  fullname: z
    .string()
    .min(3, { message: "Name must be at least 3 characters." })
    .max(50),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters." })
    .max(50)
    .toLowerCase(),
  bio: z.string().max(220),
});
