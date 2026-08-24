import Router from "express"
import { authMiddleware } from "../../middleware/auth.middleware.js"
import { validate } from "../../middleware/validate.js"
import { getNotificationsController, markAllNotificationAsReadController, markNotificationAsReadController, unReadCountNotificationController } from "./notification.controller.js"
import { getNotificationSchema, notificationIdSchema } from "./notification.validate.js"
const router = Router()

router.get('/notifications', authMiddleware, validate(getNotificationSchema), getNotificationsController)
router.get('/notifications/unread-count', authMiddleware, unReadCountNotificationController)
router.patch('/notification/', authMiddleware, markAllNotificationAsReadController)
router.patch('/notification/:notificationId', authMiddleware, validate(notificationIdSchema), markNotificationAsReadController)
export default router