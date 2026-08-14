import Router from "express"
import { authMiddleware } from "../../middleware/auth.middleware.js"
import { validate } from "../../middleware/validate.js"
import { createCommentSchema, getCommentsSchema, updateCommentSchema, deleteCommentSchema } from "./comment.validation.js"
import { createCommentController, getCommentController, updateCommentController, deleteCommentController } from "./comment.controller.js"

const router = Router()

router.post('/threads/:threadId/comment', authMiddleware, validate(createCommentSchema), createCommentController)

router.get('/threads/:threadId/comments', validate(getCommentsSchema), getCommentController)

router.patch('/threads/:commentId/', authMiddleware, validate(updateCommentSchema), updateCommentController)

router.delete('/threads/:commentId/', authMiddleware, validate(deleteCommentSchema), deleteCommentController)

export default router