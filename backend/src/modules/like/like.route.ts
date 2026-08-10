import Router from "express"
import { validate } from "../../middleware/validate.js"
import { likeSchema, unLikeSchema } from "./like.validation.js"
import { authMiddleware } from "../../middleware/auth.middleware.js"
import { likeController , unLikeController } from "./like.controller.js"
const router = Router()

router.post('/:threadId/like', authMiddleware, validate(likeSchema), likeController)
router.post('/:threadId/unlike', authMiddleware, validate(unLikeSchema), unLikeController)

export default router