import * as JWT from 'jsonwebtoken'
import { SignOptions } from 'jsonwebtoken'

const generateToken = (
  payload: object,
  secretSignature: string,
  tokenLife: string | number
): string => {
  try {
    const options: SignOptions = {
      algorithm: 'HS256',
      expiresIn: tokenLife as SignOptions['expiresIn'] 
    }

    return JWT.sign(payload, secretSignature, options)
  } catch (error: any) {
    throw new Error(error.message)
  }
}

const verifyToken = (
  token: string,
  secretSignature: string
) => {
  try {
    return JWT.verify(token, secretSignature)
  } catch (error: any) {
    throw new Error(error.message)
  }
}

export const JWTProvider = {
  generateToken,
  verifyToken
}