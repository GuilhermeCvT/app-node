const {Router} = require('express')
const UsersController = require('../controllers/usersController')
const UserAvatarController = require('../controllers/userAvatarController')
const ensureAuthenticated = require('../middleware/ensureAuthenticated')
const multer = require('multer')
const uploadConfig = require('../configs/upload')

const usersRoutes = Router()
const usersController = new UsersController()
const userAvatarController = new UserAvatarController()
const upload = multer(uploadConfig.MULTER)

usersRoutes.post('/', usersController.create)
usersRoutes.put('/', ensureAuthenticated, usersController.update)
usersRoutes.patch('/avatar', ensureAuthenticated, upload.single('avatar'), userAvatarController.update)

module.exports = usersRoutes