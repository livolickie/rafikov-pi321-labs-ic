// eslint-disable-next-line no-undef
var vm = new Vue({
    el: "#app",
    data: {
        url: '/4/api',
        state: 'os',
        os_docs: [],
        market_docs: [],
        key_docs: [],
        edit: {
            os: {name: "", platform: "", bitness: "", developer: "", users: 0},
            markets: {name: "", url: ""},
            keys: {purchase_date: "", expiration_date: "", os_id: "", market_id: "", price: "", key: ""},
            current_id: -1
        }
    },
    methods: {
        async getData() {
            if (this.state == 'os') this.os_docs = (await (await fetch(this.url+"?type="+this.state)).json())
            else if (this.state == 'markets') this.market_docs = (await (await fetch(this.url+"?type="+this.state)).json())
            else {
                this.key_docs = (await (await fetch(this.url+"?type="+this.state)).json())
                
            }
        },
        changeState(side) {
            if (side == this.state) return
            document.querySelectorAll('.select-wrapper').forEach(el => el.remove())
            this.state = side   
            this.clearEdit();
            this.getData()
            if (this.state == 'keys') {
                setTimeout(() => {
                    M.FormSelect.init(document.querySelectorAll('select'))
                }, 50)
            }

            if (this.state == 'os') {
                document.querySelector('.os-edit-side').style.gridTemplateColumns = '1fr 1fr 1fr 1fr 1fr 1fr'
            }
            else if (this.state == 'markets') {
                document.querySelector('.os-edit-side').style.gridTemplateColumns = '1fr 1fr 1fr'
            } 
            else document.querySelector('.os-edit-side').style.gridTemplateColumns = '1fr 1fr 1fr 1fr 1fr 1fr 1fr'
        },
        async addDoc() {
            let response = await fetch(this.url+'?type='+this.state, {
                method: this.edit.current_id == -1 ? 'POST' : 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    data: this.state == 'os' ? this.edit.os : (this.state == 'markets' ? this.edit.markets : this.edit.keys)
                })
            })
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
                setTimeout(() => {M.FormSelect.init(document.querySelectorAll('select'))}, 50)
            }
            this.edit.current_id = id
            M.toast({html: 'Выбрана запись для редактирования'})
            
        },
        async removeDoc(id) {
            let response = await fetch(this.url+"?type="+this.state, {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    _id: this.state == 'os' ? this.os_docs[id]._id : (this.state == 'markets' ? this.market_docs[id]._id : this.key_docs[id]._id)
                })
            })
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
                current_id: -1
            }
            setTimeout(() => {M.FormSelect.init(document.querySelectorAll('select'))}, 50)
        },
        generateReport(type) {
            M.toast({html: 'Загрузка отчёта'})
            fetch(this.url+'?generate='+type)
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
        }
    },
    mounted() {
        this.state = 'keys'; this.getData()
        this.state = 'markets'; this.getData()
        this.state = 'os'; this.getData()
    }
})