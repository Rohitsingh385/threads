import Router from "express"
import { validate } from "../../middleware/validate.js"
import { likeSchema } from "./like.validation.js"
import { authMiddleware } from "../../middleware/auth.middleware.js"
import { likeController } from "./like.controller.js"
const router = Router()

router.post('/:threadId/like', authMiddleware, validate(likeSchema), likeController)

export default router