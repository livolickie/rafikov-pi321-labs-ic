async function getQuery() {
    // M.toast({html: 'Отправка GET запроса...', displayLength: 1000})
    let username = document.querySelector("#get_username").value
    let data = await fetch(`/3/api?type=get&username=${username}`)
    M.toast({html: await data.text()})
}

async function postQuery(func = 'f2') {
    // M.toast({html: 'Отправка POST запроса...', displayLength: 1000})
    let data = null
    let a = 0 
    let b = 0
    let op = ''
    switch(func) {
        case 'f2':
            let username = document.querySelector("#post_username").value
            data = await fetch(`/3/api?type=post&username=${username}`, {
                method: 'POST'
            })
        break;

        case 'f3':
            a = document.querySelector("#a").value
            b = document.querySelector("#b").value
            op = document.querySelector("#op").checked
            data = await fetch(`/3/api?type=calc&full=false&a=${a}&b=${b}&op=${op ? 'add' : 'mult'}`, {
                method: 'POST'
            })
        break;
        
        case 'f4':
            a = document.querySelector("#a1").value
            b = document.querySelector("#b1").value
            op = document.querySelector("#op1").checked
            let full = document.querySelector("#full").checked
            data = await fetch(`/3/api?type=calc&full=${full}&a=${a}&b=${b}&op=${op ? 'add' : 'mult'}`, {
                method: 'POST'
            })
            break;

        case 'f5':
            let name = document.querySelector("#name5").value
            let surname = document.querySelector("#surname5").value
            let gender = document.querySelector("#gender5").value
            let info = document.querySelector("#info").value
            data = await fetch(`/3/api?type=${func}`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    name: name,
                    surname: surname,
                    gender: gender,
                    info: info
                })
            })
            break;

        case 'f6':
            let magic_number = document.querySelector('#magic_number').value
            data = await fetch(`/3/api?type=${func}`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    magic_number: magic_number
                })
            })
            break;

        case 't1':
            data = await fetch(`/3/api?type=${func}`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    a: document.querySelector('#t31_a').value,
                    b: document.querySelector('#t31_b').value
                })
            })
            break;

        case 't2':
            data = await fetch(`/3/api?type=${func}`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    a: document.querySelector('#t32_a').value,
                    b: document.querySelector('#t32_b').value,
                    op: document.querySelector('#t32_op').value,
                })
            })
            break;

        case 't3':
            data = await fetch(`/3/api?type=${func}`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    n: document.querySelector('#t33_n').value,
                    op: document.querySelector('#t33_op').value,
                })
            })
            break;

        case 't4':
            data = await fetch(`/3/api?type=${func}`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    login: document.querySelector('#t34_login').value,
                })
            })
            break;

        case 't5':
            let answers = []
            for(let i = 0; i < 20; i++) {
                answers.push(document.querySelector('#t35_q'+(i+1)).checked)
            }
            data = await fetch(`/3/api?type=${func}`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    name: document.querySelector('#t35_name').value,
                    answers
                })
            })
            break;

        case 't6_1':
            data = await fetch(`/3/api?type=${func}`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    number: document.querySelector('#t36_number').value,
                })
            })
            break;

        case 't6_2':
            data = await fetch(`/3/api?type=${func}`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    message: document.querySelector('#t36_message').value,
                })
            })
            break;

        case 't6_3':
            data = await fetch(`/3/api?type=${func}`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    text: document.querySelector('#t36_text').value,
                })
            })
            break;
    }
    
    if (data) M.toast({html: await data.text()})
}  