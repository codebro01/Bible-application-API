import { z } from 'zod'

const signUpSchema = z.object({
  // firstName: z.string(),
  // surname: z.string(),
  // otherNames: z.string(),
  username: z.string({ required_error: 'Username is required' }),
  isVerified: z.boolean().optional(),
  email: z
    .string({ required_error: 'Email is required' })
    .email({ message: 'Invalid email format' }), // ✅ Fixed
  role: z.string(),
  id: z.string().optional(),
  password: z
    .string({ required_error: 'Password is required' })
    .min(5, { message: 'Password must be at least 5 characters' }),
  // phone: z.string().optional(),
  // country: z.string().optional(),
  // state: z.string().optional(),
  // city: z.string().optional(),
  // cluster: z.record(z.string()).optional(), //  Accepts object like { key: "value" }
  // cell: z.record(z.string()).optional(),
  // bookmarkedContent: z.record(z.string()).optional(),
  // contributionHistory: z.string().optional(),
  // spiritualGoals: z.string().optional(),
})

const loginSchema = z.object({
  username: z
    .string({ required_error: 'Username is required' })
    .min(3, { message: 'Username must be at least 5 characters' }) // ✅ Fixed
    .max(50, { message: 'Username must be at least 5 characters' }), // ✅ Fixed
  password: z
    .string({ required_error: 'Password is required' })})

const updateUserSchema = z.object({
  firstName: z.string().optional(),
  surname: z.string().optional(),
  otherNames: z.string().optional(),
  email: z.string().email({ message: 'Invalid email format' }).optional(),
  roles: z.array(z.string()).optional(),
  phone: z.string().optional(),
  country: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  cluster: z.record(z.string()).optional(), // { key: value }
  cell: z.record(z.string()).optional(),
  bookmarkedContent: z.record(z.string()).optional(),
  contributionHistory: z.string().optional(),
  spiritualGoals: z.string().optional(),
})

 const goalSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  category: z.string().trim(),
  target: z.number(),
  timeFrame: z.string().trim(),
  currentProgress: z.number().optional(),
  description: z.string(),
})
 const updateGoalSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').optional(),
  category: z.string().trim().optional(),
  target: z.number().optional(),
  timeFrame: z.string().trim().optional(),
  description: z.string().optional(),
  currentProgress: z.number().optional(),
})

 const idSchema = z.object({
  id: z.string(),
})

 const EventStatusEnum = z.enum(['PENDING', 'CONFIRMED'])

 const createEventSchema = z.object({
  title: z.string().min(1, 'Event title is required'),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Invalid time format (HH:mm expected)',
  }),
  status: EventStatusEnum.optional().default('PENDING'),
})

 const updateEventSchema = z.object({
  title: z.string().min(1).optional(),
  date: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid date format',
    })
    .optional(),
  time: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .optional(),
  status: EventStatusEnum.optional(),
})

module.exports = {
  signUpSchema,
  loginSchema,
  updateUserSchema,
  goalSchema,
  updateGoalSchema,
  idSchema,
  createEventSchema,
  updateEventSchema,
  EventStatusEnum,
}
