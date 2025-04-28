import express from 'express'

const app = express()

// step 1
app.listen(5000, ()=>{
    console.log("Server is running on port 5000")
})