import jwt from 'jsonwebtoken'
require('dotenv-flow').config()

export const generateAccessToken = (id) => {
  return jwt.sign(
    { id: id },
    process.env.JWT_SECRET,
    { algorithm: 'HS256' }
  )
}
