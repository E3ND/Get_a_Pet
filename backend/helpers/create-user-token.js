const jwt = require('jsonwebtoken')

// Create token
const createUserToken = async(user, req, res) => {
    const token = jwt.sign({
        name: user.name,
        id: user._id
    }, 'dadounicobeoqoljsccs')

    res.status(200).json({ 
        message: 'Você está autenticado!', 
        token, 
        userId: user._id,
    })
}

module.exports = createUserToken