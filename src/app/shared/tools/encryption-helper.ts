import * as CryptoJS from 'crypto-js';

export function encryptAES(text: string, key: string) {
  return CryptoJS.AES.encrypt(text, key).toString();
}

export function decryptAES(encryptedBase64: string, key: string) {
  const decodeURI = decodeURIComponent(encryptedBase64);
  const decrypted = CryptoJS.AES.decrypt(decodeURI, key);
  if (decrypted) {
    try {
      const str = decrypted.toString(CryptoJS.enc.Utf8);
      if (str.length > 0) return str;
      else return '';
    } catch (e) {
      return '';
    }
  }
  return '';
}


export function encryptUsingAES256(text: string, key: string, initVector: string): any {
    var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(text), CryptoJS.enc.Utf8.parse(key), {
        keySize: 128 / 8,
        iv: CryptoJS.enc.Utf8.parse(initVector),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
}

export function decryptUsingAES256(decString: string, key: string, initVector: string) {
    var decrypted = CryptoJS.AES.decrypt(decString, CryptoJS.enc.Utf8.parse(key), {
        keySize: 128 / 8,
        iv: CryptoJS.enc.Utf8.parse(initVector),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
}
