import jwt from "jsonwebtoken";

export const verifyToken = (token) => {
  const payload = jwt.verify(token, process.env.JWT_SECRET,{
    algorithms: ["HS256"]
  })
  return payload
}

export const generateToken = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: "1h"
  });
  return token;
};

export const resetToken = (id) => {
  const token = jwt.sign({id}, process.env.JWT_RESETKEYS, {
    algorithm: "HS256",
    expiresIn: "1h"
  })
  return token
}

export const verifyResetToken = (token) =>{
  const payload = jwt.verify(token, process.env.JWT_RESETKEYS,{
    algorithms: ["HS256"],
    expiresIn: "1h"
  })
  return payload
}