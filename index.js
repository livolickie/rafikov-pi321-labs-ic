const express = require('express')
const path = require('path')
const fs = require('fs')

const app = express()

//User definitions
const PORT = process.env.PORT || 8000;

//Middlewares
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))
app.set("view engine", "ejs") //We will use Pug as a render engine

app.route('/').get((req, res) => res.redirect('/1'))

app.route('/:part').get((req, res, next) => {
    let part = req.params.part
    if (part == 'favicon.ico') return next()
    if (!fs.existsSync(`views/partial/part${part}.ejs`)) return res.render('404', {message: 'Work in progres...'})

    res.render("_master.ejs", {
        title: `Part ${req.params.part}`,
        helpers: {
            getRandomInt(min, max) {
                min = Math.ceil(min);
                max = Math.floor(max);
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }
        },
        renderPage: `partial/part${part}.ejs`
    })
})

app.use((req, res) => {
    res.render('404', {message: 'Маршрут не найден!'})
})

app.listen(PORT, () => {
    console.log(`Server successfully started on ${PORT}`)
})