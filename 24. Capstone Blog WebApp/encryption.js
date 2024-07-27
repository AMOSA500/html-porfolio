import CryptoJS from "crypto-js";

const key = CryptoJS.enc.Utf8.parse("123456789");

function encryptId(data) {
  return CryptoJS.AES.encrypt(data.toString(), key).toString();
}

function decryptId(data) {
    return CryptoJS.AES.decrypt(data, key).toString(CryptoJS.enc.Utf8);
    }

module.exports = {encryptId, decryptId};