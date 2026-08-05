import Router from "express"
import { validate } from "../../middleware/validate.js"
import { signupSchema, loginSchema, otpSchema,forgotPasswordSchema ,resetPasswordSchema} from "./user.validation.js"
import { signupController, loginController, meController, logoutController, refreshTokenController, verifyOtpController, resendOtpController, forgotPasswordController ,resetPasswordController} from "./user.controller.js"
import { authMiddleware } from "../../middleware/auth.middleware.js"
const router = Router()

router.post('/signup', validate(signupSchema), signupController)
router.post('/login', validate(loginSchema), loginController)
router.post('/refresh', refreshTokenController)
router.get('/me', authMiddleware, meController)
router.get('/logout', authMiddleware, logoutController)
router.post('/verify-otp', validate(otpSchema), authMiddleware, verifyOtpController)
router.post('/resend-otp', authMiddleware, resendOtpController)
router.post('/forgot-password', validate(forgotPasswordSchema) , forgotPasswordController)
router.post('/reset-password', validate(resetPasswordSchema) , resetPasswordController)
export default router