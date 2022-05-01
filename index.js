const express = require('express')
const path = require('path')
const fs = require('fs')
const mongo = require('mongodb')
const pdfMake = require('pdfmake')
const excel = require('exceljs')
const crypto = require('crypto')
const jwt = require('./utils')

const PRIVATE_KEY = 'FallInLove_NEXT'

const app = express()

//User definitions
const PORT = process.env.PORT || 8000;

let credentials = {}
if (fs.existsSync('db_credentials.json'))
    credentials = JSON.parse(fs.readFileSync('db_credentials.json'))

const MONGO_LOGIN = process.env.MONGO_LOGIN || credentials.username
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || credentials.password
const MONGO_ADDRESS = process.env.MONGO_ADDRESS || credentials.address

const MONGO_CONNECTION_STRING = `mongodb+srv://${MONGO_LOGIN}:${MONGO_PASSWORD}@${MONGO_ADDRESS}`

const db_client = new mongo.MongoClient(MONGO_CONNECTION_STRING)

//Middlewares
app.use(express.json()) //JSON body parser
app.use(express.static(path.join(__dirname, 'public')))

//Auth middleware
app.use(async (req, res, next) => {
    if (req.headers.authorization && (await req.app.locals.db.collection('jwt-blacklist').find({token: req.headers.authorization}).toArray()).length == 0) {
        req.user = jwt.verify(PRIVATE_KEY, req.headers.authorization)
    }
    next()
})

//Settings
app.set('views', path.join(__dirname, 'views'))
app.set("view engine", "ejs") //We will use EJS as a render engine

//Routing
app.route('/').get((req, res) => res.redirect('/1')) //Redirect index page to page1

app.route('/:part').get((req, res, next) => {
    let part = req.params.part
    if (part == 'favicon.ico') return next()
    if (!fs.existsSync(`views/partial/part${part}.ejs`)) return res.render('404', {message: 'Work in progres...'})

    let data = {
        title: `Part ${req.params.part}`,
        helpers: { 
            getRandomInt: (min, max) => Math.floor(Math.random() * (Math.ceil(max) - Math.ceil(min) + 1)) + Math.ceil(min)
        },
        renderPage: `partial/part${part}.ejs`
    }

    if (part == '3') {
        data.questions = [
            '1. Считаете ли Вы, что у многих ваших знакомых хороший характер? ',
            '2. Раздражают ли Вас мелкие повседневные обязанности? ',
            '3. Верите ли Вы, что ваши друзья преданы Вам? ',
            '4. Неприятно ли Вам, когда незнакомый человек делает Вам замечание? ',
            '5. Способны ли Вы ударить собаку или кошку? ',
            '6. Часто ли Вы принимаете лекарства? ',
            '7. Часто ли Вы меняете магазин, в который ходите за продуктами? ',
            '8. Продолжаете ли Вы отстаивать свою точку зрения, поняв, что ошиблись? ',
            '9. Тяготят ли Вас общественные обязанности? ',
            '10. Способны ли Вы ждать более 5 минут, не проявляя беспокойства? ',
            '11. Часто ли Вам приходят в голову мысли о Вашей невезучести? ',
            '12. Сохранилась ли у Вас фигура по сравнению с прошлым? ',
            '13. Можете ли Вы с улыбкой воспринимать подтрунивание друзей? ',
            '14. Нравится ли Вам семейная жизнь? ',
            '15. Злопамятны ли Вы? ',
            '16. Находите ли Вы, что стоит погода, типичная для данного времени года? ',
            '17. Случается ли Вам с утра быть в плохом настроении? ',
            '18. Раздражает ли Вас современная живопись? ',
            '19. Надоедает ли Вам присутствие чужих детей в доме более одного часа?',
            '20. Надоедает ли Вам делать лабораторные по PHP?',
        ]
    }

    res.render("_master.ejs", data)
})



app.route('/4/api').get(async (req, res) => {

    if (!req.user) return res.sendStatus(401)

    if (req.query.generate) { //Reports
        let os_docs = await req.app.locals.db.collection('os').find({}).toArray()
        let market_docs = await req.app.locals.db.collection('markets').find({}).toArray()
        let key_docs = await req.app.locals.db.collection('keys').find({}).toArray()
        
        let headers = [
            '№, п/п', 'Название', 'Платформа', 'Разрядность', 'Разработчик', 'Пользователи', 'Ключ', 'Приобретено', 'До', 'URL магазина'
        ]

        if (req.query.generate == 'pdf') {
            let printer = new pdfMake({Roboto:{normal:'./resources/fonts/Roboto-Regular.ttf', bold:'./resources/fonts/Roboto-Bold.ttf'}})
            let hFS = 8
            let docDefinition = {
                content: [
                    {
                        table: {
                            headerRows: 1,
                            widths: [ 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
                            body: [[]],
                        }
                    }
            ]};         

            headers.forEach(header => {
                docDefinition.content[0].table.body[0].push({
                    text: header, fontSize:hFS, bold: true
                })
            })

            let dFS = 9
            let i = 0
            key_docs.forEach(key => {
                let os = os_docs.filter(obj => {
                    if (obj._id.toString() == key.os_id.toString()) return true
                    return false
                })[0]
                let market = market_docs.filter(obj => {
                    if (obj._id.toString() == key.market_id.toString()) return true
                    return false
                })[0]
                docDefinition.content[0].table.body.push([
                    {text: i, fontSize:dFS},
                    {text: os.name, fontSize:dFS},
                    {text: os.platform, fontSize:dFS},
                    {text: os.bitness, fontSize:dFS},
                    {text: os.developer, fontSize:dFS},
                    {text: os.users, fontSize:dFS},
                    {text: key.key, fontSize:dFS},
                    {text: key.purchase_date, fontSize:dFS},
                    {text: key.expiration_date, fontSize:dFS},
                    {text: market.url, fontSize:dFS},
                ])
                i++
            })
              
            let doc = printer.createPdfKitDocument(docDefinition)
            doc.pipe(res)
            doc.end()
        } else {
            const workbook = new excel.Workbook()
            const sheet = workbook.addWorksheet('Отчёт')
            let headerRow = sheet.addRow()

            let i = 1
            headers.forEach(header => {
                headerRow.getCell(i).value = header
                i++
            })
            
            i = 0
            key_docs.forEach(key => {
                let os = os_docs.filter(obj => {
                    if (obj._id.toString() == key.os_id.toString()) return true
                    return false
                })[0]
                let market = market_docs.filter(obj => {
                    if (obj._id.toString() == key.market_id.toString()) return true
                    return false
                })[0]
                let row = sheet.addRow()
                row.getCell(1).value = i
                row.getCell(2).value = os.name
                row.getCell(3).value = os.platform
                row.getCell(4).value = os.bitness
                row.getCell(5).value = os.developer
                row.getCell(6).value = os.users
                row.getCell(7).value = os.key
                row.getCell(8).value = key.purchase_date
                row.getCell(9).value = key.expiration_date
                row.getCell(10).value = market.url
                i++
            })
            sheet.columns.forEach(function (column, j) {
                var maxLength = 0;
                column["eachCell"]({ includeEmpty: true }, function (cell) {
                    var columnLength = cell.value ? cell.value.toString().length : 10;
                    if (columnLength > maxLength ) {
                        maxLength = columnLength;
                    }
                });
                column.width = maxLength < 15 ? 15 : maxLength;
            });
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader("Content-Disposition", "attachment; filename=" + "report.xlsx");
            await workbook.xlsx.write(res)
            res.end()
        }
    } else {
        if (!req.query.type) return res.sendStatus(500)
        if (req.query.type == 'users' && req.user.type != 2) return res.sendStatus(401)

        let docs = req.app.locals.db.collection(req.query.type)
        docs.find({}).toArray((err, docs) => {
            if (err) {
                console.log(err)
                return res.sendStatus(500)
            }
            if (req.query.type == 'users') docs.forEach(doc => doc.password = "")
            res.send(docs)
        })
    }
}).post(async (req, res) => {
    if (!req.user) return res.sendStatus(401)
    if (req.query.type == 'users' && req.user.type != 2) return res.sendStatus(401)

    if (!req.query.type) return res.sendStatus(500)
    let data = req.body.data

    //Type corrections
    if (data.users) data.users = Number.parseInt(data.users)
    if (data.price) {
        data.price = Number.parseFloat(data.price)
        data.os_id = new mongo.ObjectId(data.os_id)
        data.market_id = new mongo.ObjectId(data.market_id)
    }

    let docs = req.app.locals.db.collection(req.query.type)

    //User checks
    if (req.query.type == 'users') {
        if ((await docs.find({username: data.username}).toArray()).length != 0) return res.sendStatus(500)
        data.password = crypto.createHash('sha1').update(data.password).digest('hex')
        data.type = Number.parseInt(data.type)
    }

    docs.insertOne(data, (err) => {
        // console.log(err)
        if (err) {
            res.sendStatus(500)
        }
        else res.sendStatus(200)
    }) 
})
.put(async (req, res) => {
    if (!req.user) return res.sendStatus(401)

    if (req.query.type == 'users' && (req.user.type != 2 && req.body.data._id)) return res.sendStatus(401)

    let docs = req.app.locals.db.collection(req.query.type)
    let data = req.body.data 

    //Type corrections
    if (data.users) data.users = Number.parseInt(data.users)
    if (data.price) {
        data.price = Number.parseFloat(data.price)
        data.os_id = new mongo.ObjectId(data.os_id)
        data.market_id = new mongo.ObjectId(data.market_id)
    }

    let _id = data._id 
    delete data._id //Strange moment

    if (!_id) _id = req.user.id //Self edit

    //User checks
    if (req.query.type == 'users') {
        let test_user = (await docs.find({username: data.username}).toArray())[0]
        if (test_user && test_user._id.toString() != _id) return res.sendStatus(500)
        data.type = Number.parseInt(data.type)
        if (data.password.length != 0) data.password = crypto.createHash('sha1').update(data.password).digest('hex')
        else delete data.password
    }

    docs.findOneAndUpdate({_id: new mongo.ObjectId(_id)}, {$set: data}, (err) => {
        if (err) {
            res.sendStatus(500)
        }
        else res.sendStatus(200)
    }) 
})
.delete((req, res) => {
    if (!req.user) return res.sendStatus(401)
    if (req.user.type != 2) return res.sendStatus(401)

    let docs = req.app.locals.db.collection(req.query.type)
    docs.findOneAndDelete({
        _id: new mongo.ObjectId(req.body._id)
    }, (err) => {
        if (err) {
            res.sendStatus(500)
        }
        else {
            //CASCADE delete
            if (req.query.type == 'os') {
                req.app.locals.db.collection('keys').deleteMany({os_id: new mongo.ObjectId(req.body._id)})
            }
            if (req.query.type == 'markets') {
                req.app.locals.db.collection('keys').deleteMany({market_id: new mongo.ObjectId(req.body._id)})
            }
            res.sendStatus(200)
        }
    }) 
})

app.route('/api/auth').put(async (req, res) => {
    let login = req.body.login
    let password = req.body.password

    let user = (await req.app.locals.db.collection('users').find({username: login}).toArray())[0]
    if (user) {
        if (user.password == crypto.createHash('sha1').update(password).digest('hex')) {
            //Add old JWT to blacklist
            if (user.jwt_token) req.app.locals.db.collection('jwt-blacklist').insertOne({token: user.jwt_token})
            //Generate JWT
            let jwt_token = jwt.generate(PRIVATE_KEY, {username: user.username, type: user.type, date: new Date().toISOString(), id: user._id})
            //Add token to user in db
            await req.app.locals.db.collection('users').findOneAndUpdate({username: login}, {$set: {jwt_token: jwt_token}})
            return res.send({ok: true, token: jwt_token, username: user.username, type: user.type})
        }
    }
    res.send({ok: false})
})

app.route('/3/api').get((req, res) => {
    //API for GET method
    let type = req.query.type
    res.set({'content-type': 'text/html; charset=utf-8'})
    let msg = ''
    switch(type) {
        case "f1":
            msg = `Здравствуйте, ${req.query.username}.`
        break;

        default:
            msg = 'Неверный запрос!'
    }

    res.end(msg)
}).post((req, res) => {
    let type = req.query.type
    res.set({'content-type': 'text/html; charset=utf-8'})
    let msg = ''
    var a, b, result
    switch(type) {
        case 'f2':
            msg = `Здравствуйте, ${req.body.username}.`
            break;

        case 'f3':
        case 'f4':
            a = Number.parseFloat(req.body.a)
            b = Number.parseFloat(req.body.b)
            if (!req.body.full || req.body.full == 'False')
                msg = `Результат: ${req.body.op == 'add' ? a + b : a * b}`
            else
                msg = `${a} ${req.body.op == 'add' ? '+' : '*'} ${b} = ${req.body.op == 'add' ? a + b : a * b}`
            break;

        case 'f5':
            if (req.body.gender == '1') msg += 'Уважаемый господин'
            else if (req.body.gender == '2') msg += 'Уважаемая госпожа'
            else msg += 'Уважаемый товарищ'
            msg += ` ${req.body.name} ${req.body.surname}. `
            msg += `Мы рады приветствовать вас на нашем сайте.`
            msg += ` Доп. инфо: ${req.body.info}`
        break;

        case 'f6':
            if (req.body.magic_number == 5) msg = 'Угадали! Число '+ 5
            else msg = 'Не угадали!'
            break;

        case 't1':
            a = Number.parseFloat(req.body.a)
            b = Number.parseFloat(req.body.b)
            if (a > b) msg = `${a} > ${b}`
            else if (a < b) msg = `${a} < ${b}`
            else msg = `${a} == ${b}`
            break; 

        case 't2':
            result = 0
            a = Number.parseFloat(req.body.a)
            b = Number.parseFloat(req.body.b)
            switch(req.body.op) {
                case '+': result = a + b; break;
                case '-': result = a - b; break;
                case '*': result = a * b; break;
                case '/': result = a / b; break;
            }
            msg = `${req.body.a} ${req.body.op} ${req.body.b} = ${result}`
            break;

        case 't3':
            var n = Number.parseInt(req.body.n)
            if (req.body.op == '1') msg = `Четные числа от 1 до ${n}: [`
            else if (req.body.op == '2') msg = `Нечетные числа от 1 до ${n}: [`
            else if (req.body.op == '3') msg = `Простые числа от 1 до ${n}: [`
            else msg = `Составные числа от 1 до ${n}: [`
            for(let i = 1; i < n; i++) {
                if ((i % 2 == 0 && req.body.op == '1') || (i % 2 != 0 && req.body.op == '2')) {
                    msg += ` ${i},`
                }
                else {
                    let simple = true
                    for(let j = 2; j < ((i/2) + 1); j++) {
                        if (i % j == 0) {
                            simple = false
                            break
                        }
                    }
                    if ((req.body.op == '3' && simple) || (req.body.op == '4' && !simple)) msg += ` ${i},`
                }
            }
            msg += ']'
            break;

        case 't4':
            var users = [{login: 'user1', name: "Иванов Иван Иванович"},{login: 'user2', name: "Петров Петр Петрович"},
                        {login: 'user3', name: "Алексеев Алексей Алексеевич"},{login: 'user4', name: "Морсов Морс Морсович"},]
            users.forEach(u => {
                if (u.login == req.body.login) {
                    msg = `Здравствуйте, ${u.name}!`
                    return
                }
            })
            if (msg.length == 0) msg = 'Неправильный логин!'
            break;

        case 't5':
            result = 0
            msg = `${req.body.name}, `
            var answers = req.body.answers
            for(let i = 0; i < answers.length; i++) {
                if ((answers[i] && (i == 2 || i== 8 || i == 9 || i == 12 || i == 13 || i == 18)) ||
                    (!answers[i] && !(i == 2 || i== 8 || i == 9 || i == 12 || i == 13 || i == 18)))
                    result++
            }
            if (result > 15) msg += 'У вас покладистый характер'
            else if (result >= 8 && result < 15) msg += 'Вы не лишены недостатков, но с вами можно ладить'
            else msg += 'Вашим друзьям можно посочувствовать'
            break;

        case 't6_1':
                if (Number.isInteger(Number.parseFloat(req.body.number))) msg = '1'
                else if (!isNaN(Number.parseFloat(req.body.number))) msg = '2'
                else msg = '0'
            break;

        case 't6_2':
            var m1 = req.body.message.split('')
            var m2 = req.body.message.split('')

            for(let k = 0; k < 3; k++ ){
                for(let i = 0; i < m1.length; i++) {
                    let ind = i + 1
                    if (ind == m1.length) ind = 0
                    if (k % 2 == 0) {
                        m2[ind] = m1[i]
                    } else {
                        m1[ind] = m2[i]
                    }
                }
            }
            var re = new RegExp(',', 'g');
            msg = m2.toString().replace(re,'')
            break;

        case 't6_3':
            var text = req.body.text
            var re1 = new RegExp('<i>', 'g');
            var re2 = new RegExp('</i>', 'g');
            text = text.replace(re1,'<курсив>')
            text = text.replace(re2,'<конец курсива>')
            msg = text
            break;

        default:
            msg = 'Неверный запрос!'
    }

    res.end(msg)
})

let news = [
    {id: 1, content: 'новость 1'},
    {id: 2, content: 'новость 2'},
    {id: 3, content: 'новость 3'},
    {id: 4, content: 'новость 4'},
    {id: 5, content: 'новость 5'},
    {id: 6, content: 'новость 6'},
    {id: 7, content: 'новость 7'},
    {id: 8, content: 'новость 8'},
    {id: 9, content: 'новость 9'},
    {id: 10, content: 'новость 10'},
    {id: 11, content: 'новость 11'},
    {id: 12, content: 'новость 12'}
]
let comments = [
    {id: 0, name: 'System', content: 'Комментарий из системы'}
]

//Part7
app.route('/7/api').get((req, res) => {
    //API for GET method
    let type = req.query.type
    res.set({'content-type': 'application/json; charset=utf-8'})
    let out = {}
    switch(type) {
        case "loadNews":
            let loaded = Number.parseInt(req.query.loaded)
            let need = Number.parseInt(req.query.need)
            if (loaded + need <= news.length) {
                out = news.slice(loaded, loaded + need)
            } else {
                out = news.slice(loaded, news.length - loaded)
            }
        break;

        case "loadComments":
            out = comments
        break;

        case "uploadComment":
            comments.push({
                id: comments.length,
                name: req.query.name,
                content: req.query.content
            })
            out = {ok: true}
            break;

        default:
            msg = 'Неверный запрос!'
    }
    res.json(out)
})

let vacancies = [
    {
        fio: 'Иванов Иван Иванович',
        birthday: 'Jan 10, 1990',
        city: 'Москва',
        shortStory: 'Студент. Учусь в МГУ.',
        knownTechnologies: 'JavaScript, VueJS, MongoDB, SQL',
        expectSalary: '150000'
    }
]
//Part8
app.route('/8/api').get((req, res) => {
    //API for GET method
    let type = req.query.type
    res.set({'content-type': 'application/json; charset=utf-8'})
    let out = {}
    switch(type) {
        case "loadVacancies":
            out = vacancies;
        break;

        case "uploadVacancy":
            let vacancy = JSON.parse(req.query.vacancy)
            vacancy.knownTechnologies = vacancy.knownTechnologies.join(', ')
            vacancies.push(vacancy);
        break;
    }
    res.json(out)
})

app.use((req, res) => {
    res.render('404', {message: 'Маршрут не найден!'})
})

app.listen(PORT, () => {
    console.log(`Server successfully started on ${PORT}`)
    db_client.connect((err, client) => {
        if (err) return console.log('Failed to connect MongoDB')
        app.locals.db = client.db('lab4')
        console.log('Connected to MongoDB')
    })
})