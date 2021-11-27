const jwt = require('jsonwebtoken')

function getToken(payload) {
    //const token = jwt.sign(payload, process.env.SECRET, { expiresIn: '60s' })
    const token = jwt.sign(payload, process.env.SECRET, { expiresIn: '1d' })
    return token
}

function verifyToken(token) {
    const decode = jwt.verify(token, process.env.SECRET)
    return decode
}

module.exports = { getToken, verifyToken }