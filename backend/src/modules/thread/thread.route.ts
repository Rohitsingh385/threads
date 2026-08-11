import Router from "express"
import { validate } from "../../middleware/validate.js"
import { threadSchema, threadIdSchema, userThreadSchema, updateThreadSchema } from "./thread.validation.js"
import { authMiddleware } from "../../middleware/auth.middleware.js"
import { optionalAuthMiddleware } from "../../middleware/optionalAuthMiddleware.js"
import {createThreadController, deleteThreadController, getThreadByIdController, getThreadByUsernameController, updateThreadController} from "./thread.controller.js"
const router = Router()

router.post('/create', authMiddleware ,validate(threadSchema), createThreadController )
router.get('/:id', optionalAuthMiddleware, validate(threadIdSchema), getThreadByIdController)
router.get('/user/:username', validate(userThreadSchema), getThreadByUsernameController)
router.patch('/:id',authMiddleware, validate(updateThreadSchema), updateThreadController)
router.delete('/:id',authMiddleware, validate(threadIdSchema), deleteThreadController)
export default router