import Router from "express"
import { authMiddleware } from "../../middleware/auth.middleware.js"
import { validate } from "../../middleware/validate.js"
import { createCommentSchema } from "./comment.validation.js"
import { createCommentController } from "./comment.controller.js"

const router = Router()

router.post('/threads/:threadId/comments', authMiddleware, validate(createCommentSchema), createCommentController)

export default router