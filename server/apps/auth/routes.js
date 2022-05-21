import {Router} from 'express'
import authAPIController from './controllers.js'
import authMiddleware from './middleware.js'
import path from 'path'


const router = new Router()


// Authentication pages
router.get('/login', (request, response) => {
    response.sendFile(path.resolve('..', 'client', 'apps', 'auth', 'login.html'))
})
router.post('/login', authAPIController.login)  // Sign in
router.get('/register', (request, response) => {
    response.sendFile(path.resolve('..', 'client', 'apps', 'auth', 'register.html'))
})
router.post('/register', authAPIController.register)  // Sign up
router.delete('/delete', authMiddleware, authAPIController.delete)  // Account delete


export default router
