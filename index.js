const express = require('express')
const path = require('path')
const fs = require('fs')

const app = express()

//User definitions
const PORT = process.env.PORT || 8000;

//Middlewares
app.use(express.json()) //JSON body parser
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))
app.set("view engine", "ejs") //We will use Pug as a render engine

app.route('/').get((req, res) => res.redirect('/1'))

app.route('/:part').get((req, res, next) => {
    let part = req.params.part
    if (part == 'favicon.ico') return next()
    if (!fs.existsSync(`views/partial/part${part}.ejs`)) return res.render('404', {message: 'Work in progres...'})

    data = {
        title: `Part ${req.params.part}`,
        helpers: {
            getRandomInt(min, max) {
                min = Math.ceil(min);
                max = Math.floor(max);
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }
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

app.route('/:part/api').get((req, res) => {
    //API for GET method
    let type = req.query.type
    res.set({'content-type': 'text/html; charset=utf-8'})
    let msg = ''
    switch(type) {
        case "get":
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
        case 'post':
            msg = `Здравствуйте, ${req.body.username}.`
            break;

        case 'calc':
            a = Number.parseFloat(req.body.a)
            b = Number.parseFloat(req.body.b)
            let op = req.body.op
            let full = req.body.full
            if (!full || full == 'False')
                msg = `Результат: ${op == 'add' ? a + b : a * b}`
            else
                msg = `${a} ${op == 'add' ? '+' : '*'} ${b} = ${op == 'add' ? a + b : a * b}`
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
            const MAGIC_NUMBER = 5
            if (req.body.magic_number == MAGIC_NUMBER) msg = 'Угадали! Число '+MAGIC_NUMBER
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
            let n = Number.parseInt(req.body.n)
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
            let users = [{login: 'user1', name: "Иванов Иван Иванович"},{login: 'user2', name: "Петров Петр Петрович"},
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
            let answers = req.body.answers
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
            let m1 = req.body.message.split('')
            let m2 = req.body.message.split('')

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
            let re = new RegExp(',', 'g');
            msg = m2.toString().replace(re,'')
            break;

        case 't6_3':
            let text = req.body.text
            let re1 = new RegExp('<i>', 'g');
            let re2 = new RegExp('</i>', 'g');
            text = text.replace(re1,'<курсив>')
            text = text.replace(re2,'<конец курсива>')
            msg = text
            break;

        default:
            msg = 'Неверный запрос!'
    }

    res.end(msg)
})

app.use((req, res) => {
    res.render('404', {message: 'Маршрут не найден!'})
})

app.listen(PORT, () => {
    console.log(`Server successfully started on ${PORT}`)
})