import User from './models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'


// Generates JSON web token for user authorization
function generateAccessToken(username, id) {
    const payload = {username, id}
    return jwt.sign(
        payload,
        'very_secret_key',
        {expiresIn: '1h'}
    )
}


export default class authAPIController {  // Authentication application controller
    // Trying to get User model instance by data sent
    static async login(request, response) {  // POST
        try {
            const {username, password} = request.body
            const user = User.findOne({username: username})
            if (!user) {  // User exists validation
                return response.status(400).json({
                    errors: {
                        username: ['No user with such username found']
                    }
                })
            }  // Wrong password validation
            if (!bcrypt.compareSync(password, user.password)) {
                return response.status(400).json({
                    errors: {
                        password: ['Wrong password']
                    }
                })
            }  // Sending back jwt token generated and username
            return response.status(200).json({
                token: generateAccessToken(user.username, user.id),
                username: user.username,
            })
        } catch (error) {
            console.log(error)
            return response.status(500).json({
                message: 'Request error'
            })
        }
    }
    // Creating new User model instance
    static async register(request, response) {  // POST
        try {
            const {username, password} = request.body
            let user = User.findOne({username: username})
            if(user) {
                return response.status(400).json({
                    errors: {
                        username: ['User with this username already exists']
                    }
                })
            }
            user = new User({
                username: username,
                // Storing password's hash (Blowfish cipher)
                password: bcrypt.hashSync(password, 3),
            })
            await user.save()
            return response.status(201).json('Registered')
        } catch (error) {
            console.log(error)
            return response.status(500).json({
                message: 'Request error'
            })
        }
    }
    // Deleting User model instance
    static async delete(request, response) {  // DELETE
        try {
            await User.findByIdAndRemove(request.user.id)
            return response.status(200).json('Deleted')
        } catch (error) {
            console.log(error.message)
            return response.status(500).json({
                message: 'Request error'
            })
        }
    }
}
