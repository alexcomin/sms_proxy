const crypto = require('crypto')

function decodeMessage(object, apiLink, pass) {
    const hmac = crypto.createHmac('sha256', pass)
    hmac.update(apiLink.replace(/\/|v3/g, "")+JSON.stringify(object), "utf8")
    return hmac.digest('hex')
}

module.exports.decodeMessage = decodeMessage
