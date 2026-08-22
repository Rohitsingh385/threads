import Router from "express"
import { authMiddleware } from "../../middleware/auth.middleware.js"
import { validate } from "../../middleware/validate.js"
import { getNotificationsController } from "./notification.controller.js"
import { getNotificationSchema } from "./notification.validate.js"
const router  = Router()

router.get('/notifications', authMiddleware, validate(getNotificationSchema), getNotificationsController)

export default router