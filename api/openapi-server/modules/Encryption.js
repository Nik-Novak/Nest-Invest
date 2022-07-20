//@ts-check
const crypto = require('crypto');
const Safe64 = require('url-safe-base64');
class Encryption {
  constructor(options={urlSafe:false}){
    this.options=options;
  }

  /**
   * 
   * @param {string} key 32 byte base64 key
   * @param {string} secret any string secret
   * @return {{payload:string, iv:string}} salt(hex) generated and used in encryption
   */
  encrypt(secret, key){
    let bufferKey = Buffer.from(key, 'base64');
    let iv = crypto.randomBytes(32);
    let cipher = crypto.createCipheriv('aes-256-gcm', bufferKey, iv);
    let encrypted = cipher.update(secret,'utf8', 'base64');
    encrypted += cipher.final('base64');
    const tag = cipher.getAuthTag().toString('base64'); //24 characters to append
    console.log('encrypted', encrypted);
    let payload = encrypted+tag;
    let iv64=iv.toString('base64');
    if(this.options.urlSafe){
      payload = Safe64.encode(payload);
      iv64 = Safe64.encode(iv64);
    }
    return {payload, iv:iv64};
  }

  /**
   * 
   * @param {string} payload the payload provided when encrypting 
   * @param {*} key the string secret provided when encrypting
   * @param {*} iv the salt(hex) generated and returned when encrypting
   * @returns {string} decoded secret
   */
  decrypt(payload, key, iv){
    let origKey = key;
    let origIv = iv;
    if(this.options.urlSafe){
      origKey = Safe64.decode(origKey);
      origIv = Safe64.decode(origIv);
    }
    let bufferKey = Buffer.from(origKey, 'base64');
    let bufferIv = Buffer.from(origIv, 'base64');
    let decipher = crypto.createDecipheriv('aes-256-gcm', bufferKey,bufferIv);
    let payloadEncrypted = payload.substr(0, payload.length-24);
    let payloadTag = payload.substr(payload.length-24, payload.length);
    decipher.setAuthTag(Buffer.from(payloadTag, 'base64'));
    let decrypted = decipher.update(payloadEncrypted, "base64", 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}

module.exports = Encryption;