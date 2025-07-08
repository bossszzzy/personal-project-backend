import { verifyToken } from "../utils/jwt.js"

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader) return res.status(401)

  const token = authHeader.split(" ")[1]
  try {
    const payload = verifyToken(token)
    req.userMid = payload.id
    next()
  } catch (error){
    next(error)
  }
}