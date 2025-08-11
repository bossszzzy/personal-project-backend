import { verifyToken } from "../utils/jwt.js"

export function authMiddleware(req, res, next) {
  console.log("authMiddleware")
  const authHeader = req.headers.authorization
  console.log('authHeader', authHeader)
  if (!authHeader) {
    res.status(401).json({message:"Unauthorized"})
    return
  } 

  const token = authHeader.split(" ")[1]
  console.log("token",token)
  try {
    const payload = verifyToken(token)
    req.userMid = payload.id
    req.userRole = payload.role
    console.log("before next controller")
    next()
  } catch (error){
    next(error)
  }
}