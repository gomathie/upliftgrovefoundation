import * as z from "zod";

// Shared validation schema for the confidential Get Support intake form.
// Used on the client (react-hook-form) AND re-validated on the server so a
// crafted request can never bypass the browser checks.
export const intakeSchema = z.object({
  name: z
    .string()
    .max(120, { message: "Please use a shorter name or alias." })
    .optional()
    .or(z.literal("")),
  location: z
    .string()
    .min(2, { message: "Please enter your general location or region." })
    .max(120, { message: "Please enter a shorter location." }),
  phone: z
    .string()
    .min(8, { message: "Please enter a valid phone or WhatsApp number so we can reach you." })
    .max(40, { message: "Please enter a valid phone number." }),
  message: z
    .string()
    .min(10, { message: "Please share a little bit about what you are going through." })
    .max(5000, { message: "Please shorten your message a little." }),
});

export type IntakeFormData = z.infer<typeof intakeSchema>;
