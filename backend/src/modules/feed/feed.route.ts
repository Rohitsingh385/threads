import Router from "express"
import { authMiddleware } from "../../middleware/auth.middleware.js"
import { getFeedController } from "./feed.controller.js"
import { validate } from "../../middleware/validate.js"
import { getFeedSchema } from "./feed.validation.js"
const router = Router()


router.get('/user/feed', authMiddleware, validate(getFeedSchema), getFeedController)

export default router