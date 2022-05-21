import {Router} from 'express'
import authMiddleware from '../auth/middleware.js'
import mailApiController from './controllers.js'
import path from "path";


const router = new Router()


// Mail pages
router.get('/list', (request, response) => {
    response.sendFile(path.resolve('..', 'client', 'apps', 'mail', 'mail.html'))
})
// Applying authentication middleware to restrict unauthorized access
router.use(authMiddleware)
router.get('/api/list', mailApiController.list)
router.get('/api/list/:filter(all|received|sent)', mailApiController.list_filtered)
router.post('/create', mailApiController.create)
router.delete('/delete', mailApiController.delete)
router.patch('/check', mailApiController.check)


export default router
