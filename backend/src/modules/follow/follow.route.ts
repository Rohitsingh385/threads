import Router from "express"
import { authMiddleware } from "../../middleware/auth.middleware.js"
import { validate } from "../../middleware/validate.js"
import { followSchema } from "./follow.validation.js"
import { followController, followingCountController, followerCountController } from "./follow.controller.js"
import { optionalAuthMiddleware } from "../../middleware/optionalAuthMiddleware.js"
const router = Router()

router.post('/user/:username/follow', authMiddleware, validate(followSchema), followController)
router.get('/user/:username/following', optionalAuthMiddleware ,validate(followSchema), followingCountController)
router.get('/user/:username/followers', validate(followSchema), followerCountController)
export default router