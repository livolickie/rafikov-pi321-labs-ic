const express = require('express')
const path = require('path')

const app = express()

//User definitions
const PORT = 3000

//Middlewares
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))
app.set("view engine", "ejs") //We will use Pug as a render engine

app.route('/').get((req, res) => {
    res.render("index", {
        appTitle: "Labs Rafikov Danil",
        helpers: {
            getRandomInt(min, max) {
                min = Math.ceil(min);
                max = Math.floor(max);
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }
        }
    })
})

app.use((req, res) => {
    res.render("404")
})

app.listen(PORT, () => {
    console.log(`Server successfully started on ${PORT}`)
})