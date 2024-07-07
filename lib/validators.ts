import { z } from "zod";

export const SignInValidator = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Must be at least 8 characters"),
});

export type SignInValidatorType = z.infer<typeof SignInValidator>;

export const SignUpValidator = z
  .object({
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "Must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignUpValidatorType = z.infer<typeof SignUpValidator>;

export const searchInputValidator = z.object({
  address: z
    .string()
    .min(5, { message: "Address must be at least 5 characters" }),
  propertyType: z
    .array(z.string())
    .refine((value) => value.some((item) => item), {
      message: "Please select at least one property type",
    }),
  beds: z.string(),
  baths: z.string(),
  priceMin: z.string(),
  priceMax: z.string(),
});

export type SearchInputValidatorType = z.infer<typeof searchInputValidator>;
