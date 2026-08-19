import Router from "express"
import { validate } from "../../middleware/validate.js"
import { searchByUsernameSchema } from "./search.validation.js"
import { searchUsersController } from "./search.controller.js"

const router = Router()

router.get('/users/search/:username', validate(searchByUsernameSchema), searchUsersController)

export default router 