//Vue side
let vue = new Vue({
    el: '#app',
    data() { return {
        news: [],
        comments: [],
        comment: "",
        name: "",
    }},
    methods: {
        async loadNews() {
            const TO_ADD = 3
            let data = (await (await fetch(`/7/api?type=loadNews&loaded=${this.news.length}&need=${TO_ADD}`)).json())
            if (data) this.news = this.news.concat(data)
        },
        async loadComments() {
            let data = (await (await fetch(`/7/api?type=loadComments`)).json())
            if (data) this.comments = data
        },
        async addComment() {
            if (this.comment.length > 0 && this.name.length > 0) {
                let data = await fetch(`/7/api?type=uploadComment&name=${this.name}&content=`+this.comment)
                if (data.ok) {
                    alert('Комментарий добавлен!')
                    this.comment = ""
                    this.loadComments()
                }
            }
        }
    },
    mounted() {
        this.loadNews()
        this.loadComments()
    }
})