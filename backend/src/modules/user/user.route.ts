import Router from "express"
import { validate } from "../../middleware/validate.js"
import { signupSchema, loginSchema } from "./user.validation.js"
import { signupController, loginController, meController , logoutController, refreshTokenController} from "./user.controller.js"
import { authMiddleware } from "../../middleware/auth.middleware.js"
const router = Router()

router.post('/signup', validate(signupSchema), signupController)
router.post('/login', validate(loginSchema), loginController)
router.post('/refresh',  refreshTokenController)
router.get('/me', authMiddleware, meController)
router.get('/logout', authMiddleware, logoutController)
export default router