import { z } from 'zod';
export declare const PASSWORD_MIN_LENGTH = 8;
export declare const NAME_MIN_LENGTH = 3;
export declare const PASSWORD_REGEX: RegExp;
export declare const PASSWORD_MESSAGE = "Password must be at least 8 characters with at least 1 letter, 1 number, and 1 special character (@$!%*#?&)";
export declare const NAME_MESSAGE = "Name must be at least 3 characters";
export declare const EMAIL_MESSAGE = "Invalid email format";
export declare const emailSchema: z.ZodString;
export declare const nameSchema: z.ZodString;
export declare const passwordSchema: z.ZodString;
export declare const signupSchema: z.ZodObject<{
    email: z.ZodString;
    name: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    email: string;
    password: string;
}, {
    name: string;
    email: string;
    password: string;
}>;
export declare const signinSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
//# sourceMappingURL=validation.d.ts.map