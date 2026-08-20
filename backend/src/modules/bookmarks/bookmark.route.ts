import Router from "express"
import { authMiddleware } from "../../middleware/auth.middleware.js"
import { validate } from "../../middleware/validate.js"
import { addBookmarkController, getBookmarksController } from "./bookmark.controller.js"
import { bookmarkSchema, getBookmarkSchema } from "./bookmark.validation.js"
const router = Router()

router.post('/threads/:threadId/bookmark', authMiddleware, validate(bookmarkSchema), addBookmarkController)
router.post('/bookmarks', authMiddleware, validate(getBookmarkSchema), getBookmarksController)
export default router