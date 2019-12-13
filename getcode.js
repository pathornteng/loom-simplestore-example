const rp = require('request-promise');
var JSONbig = require('json-bigint');

const config = {
    url: "http://34.87.16.107:46658/eth",
    firstBlock: 1,
    lastBlock: 100,
    frequency: 1,
}

async function getCode() {
    var options = {
        method: 'POST',
        uri: config.url,
        body: {
            "jsonrpc": "2.0",
            "method": "eth_getCode",
            "params": [
                "0xcc72490fd54c9a37D3aB33cEB03360A1A01920e1"
            ],
            "id": 73
        },
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        },
        json: true
    };

    try {

        const res = await rp(options);
        console.log(res)
    } catch (err) {
        console.log(err)
        return 0
    }
}

async function hello() {
    try {
        for (i = 0; i < 100; i++) {
            await getCode()
        }
    } catch (err) {
        console.log("should not revert", err);
    }
    timeout();
}

function timeout() {
    setTimeout(hello, 1000);
}

(async function () {
    timeout();
})();
