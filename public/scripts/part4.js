// eslint-disable-next-line no-undef
var vm = new Vue({
    el: "#app",
    data: {
        user: {token: null, type: -1, username: ""},
        url: '/4/api',
        state: 'os',
        os_docs: [],
        market_docs: [],
        key_docs: [],
        user_docs: [],
        edit: {
            os: {name: "", platform: "", bitness: "", developer: "", users: 0},
            markets: {name: "", url: ""},
            keys: {purchase_date: "", expiration_date: "", os_id: "", market_id: "", price: "", key: ""},
            users: {username: "", password: "", type: "0"},
            current_id: -1
        },
        auth: {
            login: '', password: ''
        },
        reg: {
            login: '', password: '', passwordR: '', role: '0'
        }
    },
    methods: {
        async getData() {
            let response = await fetch(this.url+"?type="+this.state, {headers: {'Authorization': this.user.token}})
            if (response.status == 401) {
                M.toast({html: 'Ваша сессия истекла'})
                return this.logout()
            }
            if (this.state == 'os') this.os_docs = await response.json()
            else if (this.state == 'markets') this.market_docs = await response.json()
            else if (this.state == 'keys') this.key_docs = await response.json()
            else this.user_docs = await response.json()
        },
        changeState(side) {
            this.state = side   
            this.getData()
            this.clearEdit();
            if (this.state == 'os') document.querySelector('.os-edit-side').style.gridTemplateColumns = '1fr 1fr 1fr 1fr 1fr 1fr'
            else if (this.state == 'markets') document.querySelector('.os-edit-side').style.gridTemplateColumns = '1fr 1fr 1fr'
            else if (this.state == 'keys') document.querySelector('.os-edit-side').style.gridTemplateColumns = '1fr 1fr 1fr 1fr 1fr 1fr 1fr'
            else document.querySelector('.os-edit-side').style.gridTemplateColumns = '1fr 1fr 1fr 1fr'
        },
        async addDoc() {
            let response = await fetch(this.url+'?type='+this.state, {
                method: this.edit.current_id == -1 ? 'POST' : 'PUT',
                headers: {'Content-Type': 'application/json', 'Authorization': this.user.token},
                body: JSON.stringify({
                    data: this.state == 'os' ? this.edit.os : (this.state == 'markets' ? this.edit.markets : (this.state == 'keys' ? this.edit.keys : this.edit.users))
                })
            })
            if (response.status == 401) {
                M.toast({html: 'Ваша сессия истекла!'})
                return this.logout()
            }
            if (response.status == 200) {
                M.toast({html: 'Записи обновлены'})
                this.clearEdit()
                this.getData()
            }
            else M.toast({html: 'Ошибка при обновлении'})
        },
        async startEdit(id) {
            if (this.state == 'os') {
                this.edit.os = JSON.parse(JSON.stringify(this.os_docs[id]))
            }
            if (this.state == 'markets') {
                this.edit.markets = JSON.parse(JSON.stringify(this.market_docs[id]))
            }
            if (this.state == 'keys') {
                this.edit.keys = JSON.parse(JSON.stringify(this.key_docs[id]))
            }
            if (this.state == 'users') {
                this.edit.users = JSON.parse(JSON.stringify(this.user_docs[id]))
            }
            this.edit.current_id = id
            M.toast({html: 'Выбрана запись для редактирования'})
            
        },
        async removeDoc(id) {
            let response = await fetch(this.url+"?type="+this.state, {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json', 'Authorization': this.user.token},
                body: JSON.stringify({
                    _id: this.state == 'os' ? this.os_docs[id]._id : (this.state == 'markets' ? this.market_docs[id]._id : (this.state == 'keys' ? this.key_docs[id]._id : this.user_docs[id]._id))
                })
            })
            if (response.status == 401) {
                M.toast({html: 'Ваша сессия истекла!'})
                return this.logout()
            }
            if (response.status == 200) {
                M.toast({html: 'Запись удалена'})
                this.getData()
            }
            else M.toast({html: 'Ошибка при удалении'})
        },
        getMarketByID(id) {
            let str = ""
            this.market_docs.forEach(doc => {
                if (doc._id == id) {
                    str = doc.name+' / '+doc.url
                    return
                }
            })
            return str
        },
        getOSById(id) {
            let str = ""
            this.os_docs.forEach(doc => {
                if (doc._id == id) {
                    str = doc.name + ' / '+doc.platform+' / '+doc.bitness
                    return
                }
            })
            return str
        },
        clearEdit() {
            this.edit = {
                os: {name: "", platform: "", bitness: "", developer: "", users: 0},
                markets: {name: "", url: ""},
                keys: {purchase_date: "", expiration_date: "", os_id: "", market_id: "", price: "", key: ""},
                users: {username: "", password: "", type: "0"},
                current_id: -1
            }
        },
        generateReport(type) {
            M.toast({html: 'Загрузка отчёта'})
            fetch(this.url+'?generate='+type, {headers: {'Authorization': this.user.token}})
                .then(resp => resp.blob())
                .then(blob => {
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.style.display = 'none';
                    a.href = url;
                    a.download = type == 'pdf' ? 'report.pdf' : 'report.xlsx';
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    a.remove()
                })
        },
        checkAuth() {
            let test_user = window.localStorage.getItem('labs4_user')
            if (test_user) {
                this.user = JSON.parse(test_user)
                this.afterAuth()
                M.toast({html: `Здравствуйте, ${this.user.username}`})
            }
            else {
                M.Modal.getInstance(document.querySelector('#modal_auth')).open()
                document.querySelector('.row').classList.remove('hide')
            }
        },
        async afterAuth(first = false) {
            this.state = 'keys';  await this.getData()
            this.state = 'markets'; await this.getData()
            this.state = 'os'; await this.getData()
            this.reg.login = this.user.username
            setTimeout(() => {
                M.FloatingActionButton.init(document.querySelectorAll('.fixed-action-btn'), {hoverEnabled: false})
                M.Modal.init(document.querySelectorAll('.modal'))
                if (first) {
                    M.TapTarget.init(document.querySelectorAll('.tap-target'), {el: 'main'});
                    M.TapTarget.getInstance(document.querySelector('.tap-target')).open()
                }
            }, 250)
        },
        async updateAccount() {
            if (this.reg.login.length == 0) return M.toast({html: 'Не задан логин!'})
            if (this.reg.password != this.reg.passwordR) return M.toast({html: 'Пароли не совпадают!'})
            let response = await fetch(this.url+'?type=users', {
                method: 'PUT',
                headers: {'Content-Type': 'application/json', 'Authorization': this.user.token},
                body: JSON.stringify({data: {
                    username: this.reg.login,
                    password: this.reg.password,
                    type: this.user.type
                }})
            }) 
            if (response.ok) {
                M.toast({html: 'Данные успешно обновлены!'})
                if (this.state == 'users') {
                    this.getData()
                }
                this.user.username = this.reg.login
                window.localStorage.setItem('labs4_user', JSON.stringify(this.user))
                this.reg.password = ""
                this.reg.passwordR = ""
                M.Modal.getInstance(document.querySelector('#modal_profile')).close()
            } else M.toast({html: 'Данное имя занято другим пользователем!'})
        },
        async login() {
            if (!(this.auth.login.length > 0)) return M.toast({html: 'Не введен логин!'})
            if (!(this.auth.password.length > 0)) return M.toast({html: 'Не введен пароль!'})

            M.toast({html: 'Авторизация...'})
            let response = await fetch('/api/auth', {
                method: 'PUT',
                headers: {'Content-Type': 'application/json', 'Authorization': this.user.token},
                body: JSON.stringify({
                    login: this.auth.login,
                    password: this.auth.password,
                })
            }) 
            if (response.ok) {
                let answer = await response.json()
                if (answer.ok) {
                    M.Modal.getInstance(document.querySelector('#modal_auth')).close()

                    this.user.token = answer.token
                    this.user.username = answer.username
                    this.user.type = answer.type
                    this.afterAuth(true)
                    M.toast({html: `Здравствуйте, ${this.user.username}`})
                    window.localStorage.setItem('labs4_user', JSON.stringify(this.user))
                } else M.toast({html: 'Неправильный логин или пароль!'})
            } else M.toast({html: 'Внутренняя ошибка сервера!'})
        },
        logout() {
            this.user.username = ''
            this.user.type = -1
            this.user.token = ''
            window.localStorage.removeItem('labs4_user')
            M.toast({html: 'Вы вышли из системы!'})
            setTimeout(() => {document.querySelector('.row').classList.remove('hide');  M.Modal.getInstance(document.querySelector('#modal_auth')).open()}, 250)
        }
    },
    mounted() {
        M.toast({html: 'Проверка авторизаци...', displayLength: 250})
        setTimeout(this.checkAuth, 500)
    }
})