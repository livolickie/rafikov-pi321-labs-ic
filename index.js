const express = require('express')

const app = express()

//User definitions
const PORT = 3000

//Middlewares
app.set("view engine", "pug") //We will use Pug as a render engine

app.use('/', (req, res) => {
    res.render("index", {
        appTitle: "Main Page",
        someVar: true,
        testList: ["Element One", "Element Two", "Element Three"]
    })
})

app.listen(PORT, () => {
    console.log(`Server successfully started on ${PORT}`)
})