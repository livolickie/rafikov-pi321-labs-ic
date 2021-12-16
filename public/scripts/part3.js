async function fetchData(body, url = "", method = 'POST') {
    return new Promise((resolve, reject) => {
        if (!body) return reject('Body parameter can\' be a null!')
        if (url.length == 0) return reject('URL can\'t be an empty!')

        fetch(url, {
            method: method,
            headers: {'Content-Type': 'application/json'},
            body: method != 'GET' ? JSON.stringify(body) : null
        }).then((response) => resolve(response))
        .catch((err) => reject(err))
    })
}

// eslint-disable-next-line no-unused-vars
async function queryToServer(func) {
    let data = ''
    let url = '/3/api?type='+func

    switch(func) {
        case 'f1':
            data = await fetchData({}, url+'&username='+document.querySelector("#get_username").value, 'GET')
            break;

        case 'f2':
            data = await fetchData({
                username: document.querySelector("#post_username").value,
            }, url)
        break;

        case 'f3':
            data = await fetchData({
                a: document.querySelector("#a").value,
                b: document.querySelector("#b").value,
                op: document.querySelector("#op").checked ? 'add' : 'multi'
            }, url)
        break;
        
        case 'f4':
            data = await fetchData({
                a: document.querySelector("#a1").value,
                b: document.querySelector("#b1").value,
                op: document.querySelector("#op1").checked ? 'add' : 'multi',
                full: document.querySelector("#full").checked
            }, url)
            break;

        case 'f5':
            data = await fetchData({
                name: document.querySelector("#name5").value,
                surname: document.querySelector("#surname5").value,
                gender: document.querySelector("#gender5").value,
                info: document.querySelector("#info").value
            }, url)
            break;

        case 'f6':
            data = await fetchData({
                magic_number: document.querySelector('#magic_number').value
            }, url)
            break;

        case 't1':
            data = await fetchData({
                a: document.querySelector('#t31_a').value,
                b: document.querySelector('#t31_b').value
            }, url)
            break;

        case 't2':
            data = await fetchData({
                a: document.querySelector('#t32_a').value,
                b: document.querySelector('#t32_b').value,
                op: document.querySelector('#t32_op').value,
            }, url)
            break;

        case 't3':
            data = await fetchData({
                n: document.querySelector('#t33_n').value,
                op: document.querySelector('#t33_op').value,
            }, url)
            break;

        case 't4':
            data = await fetchData({
                login: document.querySelector('#t34_login').value,
            }, url)
            break;

        case 't5':
            var answers = []
            for(let i = 0; i < 20; i++) {
                answers.push(document.querySelector('#t35_q'+(i+1)).checked)
            }

            data = await fetchData({
                name: document.querySelector('#t35_name').value,
                answers
            }, url)
            break;

        case 't6_1':
            data = await fetchData({
                number: document.querySelector('#t36_number').value,
            }, url)
            break;

        case 't6_2':
            data = await fetchData({
                message: document.querySelector('#t36_message').value,
            }, url)
            break;

        case 't6_3':
            data = await fetchData({
                text: document.querySelector('#t36_text').value,
            }, url)
            break;
    }
    
    // eslint-disable-next-line no-undef
    if (data) M.toast({html: await data.text()})
}  