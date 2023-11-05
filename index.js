const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000

// middle ware
app.use(cors())
app.use(express.json())


// console.log(process.env.DB_NAME)

// 
app.get('/', (req, res) => {
    res.send('app is running')
})
app.listen(port, () => {
    console.log(`app is running port on : ${port}`)
})