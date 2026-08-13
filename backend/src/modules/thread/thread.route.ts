import Router from "express"
import { validate } from "../../middleware/validate.js"
import { threadSchema, threadIdSchema, userThreadSchema, updateThreadSchema } from "./thread.validation.js"
import { authMiddleware } from "../../middleware/auth.middleware.js"
import { optionalAuthMiddleware } from "../../middleware/optionalAuthMiddleware.js"
import {createThreadController, deleteThreadController, getThreadByIdController, getThreadByUsernameController, updateThreadController} from "./thread.controller.js"
import commentRoute from "../comments/comment.route.js"
import likeRoute from "../like/like.route.js"
const router = Router()

router.post('/', authMiddleware ,validate(threadSchema), createThreadController )
router.get('/user/:username', validate(userThreadSchema), getThreadByUsernameController)

router.use('/:threadId/comments', commentRoute)

router.use('/:threadId/likes', likeRoute)

router.get('/:id', optionalAuthMiddleware, validate(threadIdSchema), getThreadByIdController)
router.patch('/:id',authMiddleware, validate(updateThreadSchema), updateThreadController)
router.delete('/:id',authMiddleware, validate(threadIdSchema), deleteThreadController)

export default router