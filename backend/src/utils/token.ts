import crypto from "node:crypto"

export const generateHexToken = ()=> {
    return crypto.randomBytes(32).toString('hex')
}