const getToken = (req) => {
    const authHeader = req.headers.authorization

    //Cut bearer token
    const token = authHeader.split(' ')[1]

    return token
}

module.exports = getToken