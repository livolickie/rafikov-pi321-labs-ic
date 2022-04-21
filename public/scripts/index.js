// eslint-disable-next-line no-undef
M.AutoInit() //Initialize Materialize
// eslint-disable-next-line no-undef
AOS.init() //Initialize AOS Library for scroll animations

const PAGE_COUNT = document.querySelectorAll('li.li_link').length

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

        li_arrows[0].addEventListener('click', () => {
            if (page_num - 1 > -1) window.location.replace(`/${page_num}`)
  
        })
        li_arrows[1].addEventListener('click', () => {
            if (page_num + 1 < PAGE_COUNT) window.location.replace(`/${page_num+2}`)
        })

    } catch(err) {
        console.log(err)
    }
}

let letters = document.querySelectorAll('.letter')
    for(let i = 0; i < letters.length; i++) {
        letters[i].style.animationDuration = getRndRange(1, 1.8) + 's';
        letters[i].style.backgroundColor = `rgb(${getRndRangeInt(0,255)},${getRndRangeInt(0,255)},${getRndRangeInt(0, 255)})`;  

        let rnd = getRndRangeInt(1, 4)
        if (rnd >= 1 && rnd < 3) {
            letters[i].style.borderRadius = '100%'; 
        } else if (rnd < 4) {
            letters[i].style.borderRadius = '10%'; 
        } else if (rnd >= 4) {
            letters[i].style.width = 0;
            letters[i].style.height = 0;
            letters[i].style.borderLeft = '2.5rem solid transparent';
            letters[i].style.borderRight = '2.5rem solid transparent';
            letters[i].style.backgroundColor = 'rgba(0,0,0,0)'
            letters[i].style.height = 0;
            letters[i].style.borderBottom = '4rem solid '+`rgb(${getRndRangeInt(0,255)},${getRndRangeInt(0,255)},${getRndRangeInt(0,255)})`
        }
        letters[i].style.marginLeft = getRndRange(0, 7)+'rem';
    }

    function getRndRangeInt(from, to) {
        return Math.floor(Math.random() * to + from);
    }

    function getRndRange(from, to) {
        return Math.random() * to + from;
    }

navUpdate()