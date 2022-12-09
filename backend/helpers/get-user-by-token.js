const jwt = require('jsonwebtoken')

const User = require('../models/User')

// Pegar usuário pelo jwt token
const getUserByToken = async (token) => {
    if(!token) {
        return res.status(401).json({ message: 'Acesso negado!' })
    }

    const decoded = jwt.verify(token, 'dadounicobeoqoljsccs')

    // const userId = decoded.id
    const user = await User.findOne({ _id: decoded.id })

    return user
}

module.exports = getUserByToken