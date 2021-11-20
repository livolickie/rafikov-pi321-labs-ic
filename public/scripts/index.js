M.AutoInit() //Initialize Materialize
AOS.init() //Initialize AOS Library for scroll animations

const PAGE_COUNT = 2

let page_num = -1

function navUpdate() {
    try {
        let li_list = document.querySelectorAll('.li_link')
        let li_arrows = document.querySelectorAll('li.arrow')
        let splitted = document.URL.split('/')
        page_num = Number.parseInt(splitted[splitted.length - 1]) - 1
        li_list[page_num].classList.add('active')

        if (page_num == 0) li_arrows[0].classList.add('disabled')
        if (page_num+1 >= PAGE_COUNT) li_arrows[1].classList.add('disabled')

        li_arrows[0].addEventListener('click', (eent) => {
            if (page_num - 1 > -1) window.location.replace(`/${page_num}`)
  
        })
        li_arrows[1].addEventListener('click', () => {
            if (page_num + 1 < PAGE_COUNT) window.location.replace(`/${page_num+2}`)
        })

    } catch(err) {
        console.log(err)
    }
}

navUpdate()