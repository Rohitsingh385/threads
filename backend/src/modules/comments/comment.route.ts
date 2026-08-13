import Router from "express"
import { authMiddleware } from "../../middleware/auth.middleware.js"
import { validate } from "../../middleware/validate.js"
import { createCommentSchema, getCommentsSchema, updateCommentSchema } from "./comment.validation.js"
import { createCommentController, getCommentController, updateCommentController } from "./comment.controller.js"

const router = Router()

router.post('/threads/:threadId/comment', authMiddleware, validate(createCommentSchema), createCommentController)

router.get('/threads/:threadId/comments', validate(getCommentsSchema), getCommentController)

router.patch('/threads/:commentId/', authMiddleware, validate(updateCommentSchema), updateCommentController)

export default router