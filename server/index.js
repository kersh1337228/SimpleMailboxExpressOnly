import express from 'express'
import cors from 'cors'
import path from 'path'
import authRouter from './apps/auth/routes.js'
import mailRouter from './apps/mail/routers.js'


// Configuration variables
const PORT = process.env.PORT || 5000
const app = express()


// Applying middleware
app.use(express.static(path.resolve('..', 'client', 'apps')))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))


// Specifying applications urls
app.use('/auth', authRouter)
app.use('/mail', mailRouter)
app.get('/', (request, response) => {
    response.sendFile(path.resolve('..', 'client', 'apps', 'general', 'home.html'))
})


const init = async () => {  // Server initialization method
    try {
        app.listen(PORT, () => {
            console.log(`Running server on port ${PORT}`)
        })
    } catch (error) {
        console.log(error)
    }
}


init()
