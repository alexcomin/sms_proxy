const http = require('http')
const setting = require('./config.json')
const { sendPost } = require('./request')

const config = {
    "head" : {
        "access-control-allow-origin": "*",
        "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
        "access-control-allow-headers": "content-type, accept",
        "access-control-max-age": 10,
        "Content-Type": "application/json; charset=utf-8"
    },
    "setting" : {
        "port" : 3000
    }
}

let status = {
    status_server: 'OK'
}

const server = http.createServer((req, res) => {
    let promise = new Promise(function(resolve, reject) {
        let raw = []
        req.on('data', function(buf){
          raw.push(buf)
        })
        req.on('end', function() {
          resolve(Buffer.concat(raw).toString('utf-8'))
        })
      }).catch(e => {console.log(e)});

    if (req.method === "GET" && req.url === "/status") {
        res.writeHead(200, config.head);
        status.status_server = "OK"
        res.end(JSON.stringify(status, null, '\t'));
        return;
    }
    if (req.url === "/api/v3/message" && req.method === "POST") {
        promise.then(value => {
            let data = JSON.parse(value)
            res.writeHead(200, config.head);
            status.status_server = "REQUEST POST OK"
            console.log(status)
            sendPost(setting, data)
            res.end('message send');
            data = null
        }, function(e) {
            console.log(e)
            res.end(`message fail: ${e}`);
        }).catch(e => {
            res.end(`message fail: ${e}`);
        })
        promise = null
        return;
    }
    res.writeHead(502)
    res.end(`502`);
    return;
})

server.listen(3000)