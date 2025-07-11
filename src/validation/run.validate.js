import createError from "../utils/createError.js";

export const validate = (schema, option = {}) =>{
  return async function (req,res,next) {
    try {
      const cleanbody = await schema.validate(req.body, {abortEarly:false, ...option})
      req.body = cleanbody
      next()
    } catch (error) {
      let errMsg = error.errors.join('|||')
      console.log(errMsg)
      createError(400, errMsg)      
    }
  }
} 