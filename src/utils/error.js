const error = ((error, req, res, next)=>{
  res.status(error.code || 500).json({message: error.message || "Something went wrong"})
})

export default error