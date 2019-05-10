const http = require('http')
const https = require('https')
const { decodeMessage } = require('./hmac')

function sendPost(config, object) {
    const port = config.options.port == 443 ? https : http;
    config.options.body.msisdn = object.tel.replace('+',"")
    config.options.body.text = object.message
    config.options.headers['Authorization'] = 'Bearer '+decodeMessage(config.options.body, config.options.path, config.api_pass)
    
    const request = port.request(config.options, response => {
        console.log(`HEADERS: ${JSON.stringify(response.headers, null, '\t')}`) 
        console.log(`STATUS CODE: ${response.statusCode}`);
        let bodyChancks = []
        response.on('data', chunk => {
            bodyChancks.push(chunk)
        })
        response.on('end', () => {
            console.log(Buffer.concat(bodyChancks).toString('utf-8'))
            bodyChancks = null
        })
    })
    request.write(JSON.stringify(config.options.body))
    request.on('error', e => {
        console.log(`ERROR: ${e}`)
    }) 
    request.end();
    return
}

module.exports.sendPost = sendPost