"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signinSchema = exports.signupSchema = exports.passwordSchema = exports.nameSchema = exports.emailSchema = exports.EMAIL_MESSAGE = exports.NAME_MESSAGE = exports.PASSWORD_MESSAGE = exports.PASSWORD_REGEX = exports.NAME_MIN_LENGTH = exports.PASSWORD_MIN_LENGTH = void 0;
const zod_1 = require("zod");
// ============ CONSTANTS (Single Source of Truth) ============
exports.PASSWORD_MIN_LENGTH = 8;
exports.NAME_MIN_LENGTH = 3;
exports.PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
exports.PASSWORD_MESSAGE = 'Password must be at least 8 characters with at least 1 letter, 1 number, and 1 special character (@$!%*#?&)';
exports.NAME_MESSAGE = 'Name must be at least 3 characters';
exports.EMAIL_MESSAGE = 'Invalid email format';
// ============ ZOD SCHEMAS ============
exports.emailSchema = zod_1.z.string().email(exports.EMAIL_MESSAGE).toLowerCase().trim();
exports.nameSchema = zod_1.z.string().min(exports.NAME_MIN_LENGTH, exports.NAME_MESSAGE).trim();
exports.passwordSchema = zod_1.z
    .string()
    .min(exports.PASSWORD_MIN_LENGTH, `Password must be at least ${exports.PASSWORD_MIN_LENGTH} characters`)
    .regex(exports.PASSWORD_REGEX, exports.PASSWORD_MESSAGE);
exports.signupSchema = zod_1.z.object({
    email: exports.emailSchema,
    name: exports.nameSchema,
    password: exports.passwordSchema,
});
exports.signinSchema = zod_1.z.object({
    email: exports.emailSchema,
    password: zod_1.z.string().min(1, 'Password is required'),
});
//# sourceMappingURL=validation.js.map