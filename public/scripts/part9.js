//Vue side

const Cell = Vue.component('Cell', {
    name: 'Cell',
    props: {
        // clickCell: {
        //     type: Function,
        //     required: true
        // },
        cell: {
            type: Object,
            required: true
        }
    },
    template: `
        <div class='cell' v-on:click='$emit("click")'>
            {{cell.data}}
        </div>
    `
})

const Board = Vue.component('Board', {
    name: 'Board',
    components: {
        'Cell': Cell
    },
    props: {
        board: {
            type: Array,
            required: true
        },
        cell_click: {
            type: Function,
            required: true
        }
    },
    methods: {
        log() {
            console.log('LOG!')
        }
    },
    template: 
        `<div class='board'>
            <div class='board-row' v-for='(row, i) in board' :key='i'>
                <template v-for='(cell, j) in row'>
                    <Cell :cell='board[i][j]' v-on:click='cell_click(i, j)' :key='j'/>
                </template>
            </div>
        </div>`
})

let vue = new Vue({
    el: '#app',
    data() { return {
        N: 3,
        board: [],
        xStep: true,
        history: [],
        historyIndex: -1,
        winner: ''
    }},
    components: {
        'Board': Board
    },
    watch: {
        N(val) {
            this.initBoard()
        }
    },
    methods: {
        initBoard() {
            this.board = []
            for(let i = 0; i < this.N; i++) {
                this.board.push([])
                for(let j = 0; j < this.N; j++) {
                    this.board[i].push({data: ''})
                }
            }
            this.history = []
            this.winner = ''
            this.saveHistory()
        },
        saveHistory() {
            this.history.push({
                board: this.board.map(row => {
                    return row.map(val => {
                        return {...val}
                    })
                }),
                xStep: this.xStep
            })
        },
        clickCell(row, pos) {
            if (this.winner != '' && this.historyIndex == -1) return

            if (this.board[row][pos].data == '') {
                if (this.historyIndex != -1) {
                    this.history.splice(this.historyIndex, this.history.length - this.historyIndex)
                    this.historyIndex = -1
                    this.winner = ''
                    this.saveHistory()
                }
                this.board[row][pos].data = this.xStep ? 'X' : 'O'
                this.xStep = !this.xStep
                
                this.saveHistory()

                this.checkWinner()
            }
        },
        checkWinner() {
            let step = ''
            let points = 0

            //Check horizontal
            for(let i = 0; i < this.N; i++) {
                step = ''
                points = 0
                for(let j = 0; j < this.N; j++) {
                    let nextStep = this.board[i][j].data
                    if (step == '' && nextStep != '') points = 1
                    if (step == nextStep) {
                        points++
                    }
                    if (nextStep == '') {
                        points = 0
                    }
                    step = nextStep
                }
                if (points == this.N) {
                    this.winner = step
                    return 
                }
            }

            for(let i = 0; i < this.N; i++) {
                step = ''
                points = 0
                for(let j = 0; j < this.N; j++) {
                    let nextStep = this.board[j][i].data
                    if (step == '' && nextStep != '') points = 1
                    if (step == nextStep) {
                        points++
                    }
                    if (nextStep == '') {
                        points = 0
                    }
                    step = nextStep
                }
                if (points == this.N) {
                    this.winner = step
                    return 
                }
            }

            points = 0
            step = ''

            //Check diagonal 1
            for(let i = 0; i < this.N; i++) { 
                let nextStep = this.board[i][i].data
                if (step == '' && nextStep != '') points = 1
                if (step == nextStep) {
                    points++
                }
                if (nextStep == '') {
                    points = 0
                }
                step = nextStep
            }
            if (points == this.N) {
                this.winner = step
                return 
            }

            points = 0
            step = ''

            //Check diagonal 2
            for(let i = this.N - 1; i >= 0; i--) { 
                
                let nextStep = this.board[this.N - 1 - i][i].data
                if (step == '' && nextStep != '') points = 1
                if (step == nextStep) {
                    points++
                }
                if (nextStep == '') {
                    points = 0
                }
                step = nextStep
            }
            if (points == this.N) {
                this.winner = step
                return 
            }

            points = 0
            for(let i = 0; i < this.N; i++) {
                for(let j = 0; j < this.N; j++) {
                    if (this.board[i][j].data == '') points++
                }
            }
            if (points == 0) this.winner = 'Никто'
        },
        moveHistory(i) {
            if (this.history[i]) {
                this.board = this.history[i].board
                this.xStep = this.history[i].xStep
                this.historyIndex = i
            }
        }
    },
    mounted() {
        this.initBoard()
    }
})