//task 1
$('button#task1Red').click(() => {
    $('body').css('background-color', 'red')
})
$('button#task1Default').click(() => {
    $('body').css('background-color', 'white')
})

//task 2
$('button#task2Send').click(e => {
    e.preventDefault()

    if ($('input#name').val().length == '') return alert('Введите имя!')
    
    if ($('input#password').val().length < 4 || $('input#password').val() != $('input#rpassword').val()) 
        return alert('Введите корректно пароли!')
    if ($('input#email').val().length < 3 || !$('input#email').val().includes('@')) 
        return alert('Введите корректный email!')
    if ($('textarea#message').val().length < 10) 
        return alert('Введите больше символов в сообщении! (минимум 10)')

    alert('Все верно!')
})

$('button#task2Clear').click(e => {
    e.preventDefault()

    $('input#name').val('')
    $('input#password').val('')
    $('input#rpassword').val('')
    $('input#email').val('')
    $('input#subject').val('')
    $('textarea#message').val('')

})

//task3
$('button#left').click(e => {
    $('img#task3').animate({
        left:'-=100'},1000)
})
$('button#up').click(e => {
    $('img#task3').animate({
        top:'-=100'},1000)
})
$('button#right').click(e => {
    $('img#task3').animate({
        left:'+=100'},1000)
})
$('button#down').click(e => {
    $('img#task3').animate({
        top:'+=100'},1000)
})

//task4
$('body').mousemove(e => {
    $('p#mouse_x').text('Mouse X: ' + e.pageX)
    $('p#mouse_y').text('Mouse Y: ' + e.pageY)
})


let currentDragElement = null
//task 5
$('.drag').mousedown(e => {
    currentDragElement = e.target
})

$('body').mousemove(e => {
    if (currentDragElement) {
        $(currentDragElement).offset({left: e.pageX-16, top: e.pageY-16})
    }
})

$('.drag').mouseup(e => {
    currentDragElement = null
})

let mansVotes = 0
let womansVotes = 0

$('#vote').click(e => {
    e.preventDefault()
    
    if ($('input#rMans').is(':checked')) {
        mansVotes += 1
    } else if ($('input#rWomans').is(':checked')) {
        womansVotes += 1
    }
    $('input#rMans').prop('checked', false)
    $('input#rWomans').prop('checked', false)

    if (!mansVotes && !womansVotes) return
    $('p#mans').text(`Мужчин: ${(mansVotes / (mansVotes + womansVotes)) * 100}%`)
    $('p#womans').text(`Женщин: ${(womansVotes / (mansVotes + womansVotes)) * 100}%`)
})

//task7
let calcStr = ''
let dotOp = false

function append_op(op) {
    if (calcStr == 'ERROR') calcStr = ''

    if (op == '.') {
        if (dotOp) return
        dotOp = true
    }

    let ops = ['+', '-', '*', '/', '.']
    if (ops.slice(0, ops.length - 1).includes(op)) dotOp = false
    if (ops.includes(op) && ops.includes(calcStr[calcStr.length - 1])) return

    if (op != 'clear' && op != 'back' && op != 'calc') calcStr += op
    else {
        switch(op) {
            case 'clear': 
                calcStr = ''
                dotOp = false
                break;

            case 'back': 
                console.log(calcStr.substring(calcStr.length - 1 , calcStr.length))
                if (calcStr.substring(calcStr.length - 1, calcStr.length) == '.') dotOp = false
                if (calcStr.length > 1) {
                    calcStr = calcStr.substring(0, calcStr.length - 1)
                }
                else if (calcStr.length == 1) calcStr = ''
                break;

            case 'calc': 
                try {
                    calcStr = eval(calcStr)
                    dotOp = false
                } catch(ex) {
                    console.log(ex)
                    calcStr = 'ERROR'
                }
            break;
        }
    }

    $('input#calcStr').val(calcStr)
}