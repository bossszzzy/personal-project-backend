import express from "express"
import dotenv from "dotenv"
import authRoute from "./routes/auth.route.js"
import userRoute from "./routes/user.routh.js"

const app = express()
dotenv.config()
app.use(express.json())

const PORT = process.env.PORT || 8000 

app.use('/api/auth',authRoute)

app.use('/api/categories',userRoute)






app.listen(PORT, ()=>{
  console.log(`Server is running on http://localhost:${PORT}` )
})


