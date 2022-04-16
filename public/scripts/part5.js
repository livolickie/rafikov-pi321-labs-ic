function greetingByTask2() {
    if (!document.querySelector('li#task2').classList.contains('active')) {
        
        alert('Добро пожаловать!')

        document.querySelector("p#task2").innerHTML = 'Добро пожаловать'
    }
}

function task3() {
    if (!document.querySelector('li#task3').classList.contains('active')) {
        let name = prompt('Ваше имя')
        let repeat = confirm('Начать заново?')
        if (repeat) alert('Не надоело?')
        else alert("Ну и правильно")

        document.querySelector("p#task3").innerHTML = 'Ваше имя: '+name
    }
}

function task4() {
    let x = parseInt(prompt('Введите x'))
    let y = parseInt(prompt('Введите y'))
    
    if (x < y) alert('x < y')
    else if (x > y) alert('x > y')
    else alert('x = y')
}

function task4_pass() {
    const PASSWORD = "123"

    let attempt = prompt('Введите пароль')

    if (attempt == PASSWORD) alert('Пароль верный')
    else alert('Пароль неверный')
}