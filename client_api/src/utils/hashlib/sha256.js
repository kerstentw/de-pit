const crypto = require('crypto');
const util = require('util');

async function sha256(message) {
    let hashHex = crypto.createHash('sha256').update(message).digest('hex');
    return hashHex;
}

module.exports =  sha256;
