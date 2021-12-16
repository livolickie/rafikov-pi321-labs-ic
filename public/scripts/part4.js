var os_docs
var edit_id = -1
const URL = '/4/api'

async function on_PageLoad() {
    document.querySelector('#btn-save').addEventListener('click', on_BtnPres)
    updateData()
}

async function updateData() {
    os_docs = (await (await fetch(URL)).json())
    render()
}

function add_Doc() {
    fetch(URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            name: document.querySelector('#edit-name').value,
            platform: document.querySelector('#edit-platform').value,
            bitness: document.querySelector('#edit-bitness').value,
            developer: document.querySelector('#edit-developer').value,
            users: document.querySelector('#edit-users').value,
        })
    }).then((response) => {
        if (response.status == 200) {
            M.toast({html: 'Запись добавлена'})
            updateData()
        }
        else M.toast({html: 'Ошибка при добавлении'})
    })
    .catch((err) => {M.toast({html: err})})
}

function edit_Doc() {
    fetch(URL, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            _id: os_docs[edit_id]._id,
            name: document.querySelector('#edit-name').value,
            platform: document.querySelector('#edit-platform').value,
            bitness: document.querySelector('#edit-bitness').value,
            developer: document.querySelector('#edit-developer').value,
            users: document.querySelector('#edit-users').value,
        })
    }).then((response) => {
        if (response.status == 200) {
            M.toast({html: 'Запись сохранена'})
            updateData()
        }
        else M.toast({html: 'Ошибка при редактировании'})
    })
    .catch((err) => {M.toast({html: err})})

    document.querySelectorAll('input').forEach(el => el.value = '')
}
function on_BtnPres() {
    if (edit_id == -1) {
        add_Doc()
    } else {
        edit_Doc()
        edit_id = -1
    }
}

function on_Edit(id) {
    edit_id = id
    document.querySelector('#edit-name').value = os_docs[id].name
    document.querySelector('#edit-platform').value = os_docs[id].platform
    document.querySelector('#edit-bitness').value = os_docs[id].bitness
    document.querySelector('#edit-developer').value = os_docs[id].developer
    document.querySelector('#edit-users').value = os_docs[id].users_count
    document.querySelector('#btn-save').innerHTML = 'Сохранить'
}

function on_Delete(id) {
    fetch(URL, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            _id: os_docs[id]._id
        })
    }).then((response) => {
        console.log(response)
        if (response.status == 200) {
            M.toast({html: 'Запись удалена!'})
            updateData()
        }
        else M.toast({html: 'Ошибка при удалении'})
    })
}


function render() {
    if (!os_docs) return console.log('Nothing to render')
    if (os_docs) {
        //Clear

        let os_side = document.querySelector("#os_side")
        os_side.innerHTML = ''

        let i = 0
        os_docs.forEach(doc => {
            let ul = document.createElement('ul')
            let li = [document.createElement('li'),document.createElement('li'),document.createElement('li'),document.createElement('li'),document.createElement('li')]
            li[0].innerHTML = '<strong>Название: </strong><span>'+doc.name+'</span>'
            li[1].innerHTML = '<strong>Платформа: </strong><span>'+doc.platform+'</span>'
            li[2].innerHTML = '<strong>Разрядность: </strong><span>'+doc.bitness+'</span>'
            li[3].innerHTML = '<strong>Разработчик: </strong><span>'+doc.developer+'</span>'
            li[4].innerHTML = '<strong>Пользователи: </strong><span>'+doc.users_count+'</span>'
            li.forEach(el => {
                ul.dataset.aos = 'fade-right'
                ul.appendChild(el)
            })
            let edit_btn = document.createElement('a')
            edit_btn.innerHTML = '<i class="material-icons">edit</i>'
            let delete_btn = document.createElement('a')
            delete_btn.innerHTML = '<i class="material-icons">delete</i>'

            edit_btn.classList = 'btn-floating blue waves-effect'   

            let k = i //Strange moment
            edit_btn.addEventListener('click', () => {
                on_Edit(k)
            })
            delete_btn.classList = 'btn-floating red waves-effect'
            delete_btn.addEventListener('click', () => {
                on_Delete(k)
            })

            ul.appendChild(edit_btn)
            ul.appendChild(delete_btn)
            os_side.appendChild(ul)
            
            i++
        });
    }
}

on_PageLoad()