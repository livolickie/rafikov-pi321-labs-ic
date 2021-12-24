const crypto = require('crypto')

const jwt = {
    generate(key, user) {
        let head = Buffer.from(JSON.stringify({
            alg: 'HS256', typ: 'jwt'
        })).toString('base64')
        
        let body = Buffer.from(JSON.stringify({user})).toString('base64')

        let signature = crypto.createHmac('SHA256', key).update(`${head}.${body}`).digest('base64')

        return `${head}.${body}.${signature}`
    },
    verify(key, token) {
        let tokenParts = token.split('.')
        let signature = crypto.createHmac('SHA256', key).update(`${tokenParts[0]}.${tokenParts[1]}`).digest('base64')
        if (signature === tokenParts[2]) {
            return JSON.parse(Buffer.from(tokenParts[1], 'base64').toString('utf-8')).user
        }
        return null
    }
}

module.exports = jwt