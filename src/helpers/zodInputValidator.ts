import type { ZodType, ZodError } from 'zod'

module.exports = function safeValidate<T>(schema: ZodType<T>, data: unknown) {
  const result = schema.safeParse(data)
  if (!result.success) {
    return {
      success: false,
      errors: result.error.issues.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    }
  }
  return {
    success: true,
    data: result.data,
  }
}
