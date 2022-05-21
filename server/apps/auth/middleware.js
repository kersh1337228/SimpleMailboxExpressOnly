import jwt from 'jsonwebtoken'


// Authorization middleware function (jwt token validation)
export default function authMiddleware(request, response, next) {
    if (request.method === 'OPTIONS') next()  // Skipping configuration requests
    try {  // Getting jwt token value from 'Bearer <token>' Authorization header string
        const token = request.headers.authorization.split(' ')[1]
        if (!token) {  // No token validation
            throw Error('No authorization token')
        } else {  // Passing user to request
            request.user = jwt.verify(token, 'very_secret_key')
        }
        next()
    } catch (error) {
        console.log(error)
        // Causes client to clear local storage and sign out
        response.status(401).json('TokenError')
    }
}
