import Router from "express"
import { validate } from "../../middleware/validate.js"
import { signupSchema, loginSchema, otpSchema, forgotPasswordSchema, resetPasswordSchema, updateProfileSchema,getDetailsSchema } from "./user.validation.js"
import { signupController, loginController, meController, logoutController, refreshTokenController, verifyOtpController, resendOtpController, forgotPasswordController, resetPasswordController, updateProfileController, getDetailsController } from "./user.controller.js"
import { authMiddleware } from "../../middleware/auth.middleware.js"
import multer from "multer"
import { optionalAuthMiddleware } from "../../middleware/optionalAuthMiddleware.js"

const storage = multer.memoryStorage()
export const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
})
const router = Router()

router.post('/signup', validate(signupSchema), signupController)
router.post('/login', validate(loginSchema), loginController)

router.post('/refresh', refreshTokenController)

router.get('/me', authMiddleware, meController)
router.get('/logout', authMiddleware, logoutController)

router.post('/verify-otp', validate(otpSchema), authMiddleware, verifyOtpController)
router.post('/resend-otp', authMiddleware, resendOtpController)

router.post('/forgot-password', validate(forgotPasswordSchema), forgotPasswordController)
router.post('/reset-password', validate(resetPasswordSchema), resetPasswordController)

// user profile
router.patch('/profile', authMiddleware, upload.single('avatarUrl'), validate(updateProfileSchema), updateProfileController)

router.get('/:username',optionalAuthMiddleware, validate(getDetailsSchema), getDetailsController)

export default router