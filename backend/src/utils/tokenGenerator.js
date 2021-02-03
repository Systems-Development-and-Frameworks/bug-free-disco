import jwt from 'jsonwebtoken'
require('dotenv-flow').config()

export const generateAccessToken = (id, name) => {
  return jwt.sign(
    { id: id, name: name },
    process.env.JWT_SECRET,
    { algorithm: 'HS256' }
  )
}
