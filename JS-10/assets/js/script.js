window.addEventListener('DOMContentLoaded', () => {
    let form = document.getElementById('search-form');

    if(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            findFilms(undefined, e.target)
        })
    }
})

function findFilms(page = 1, form) {
    let titleField = form.querySelector('input[type=search]'),
        typeField = form.querySelector('select[name=type]');

    // if(titleField.value.length > 0) {
    //     // enter your logic here
    // }

    if(titleField.value.length === 0) {
        return;
    }

    axios({
        url: form.action, // form.getAttribute('action'),
        method: form.method, // form.getAttribute('method')
        params: {
            s: titleField.value,
            type: typeField.value,
            page: page,
            
        },
        responseType: 'json'
    })
        .then((res) => {
            let resultsBlock = document.getElementById('search-results');
            if(!resultsBlock) {
                return;
            }

            resultsBlock.innerHTML = '';

            if(res.data.Error) {
                resultsBlock.innerHTML = res.data.Error
            } else if(res.data.Search && res.data.totalResults) {
                for(let i = 0; i < res.data.Search.length; i++) {
                    resultsBlock.append(createFilmItem(res.data.Search[i]))
                }

                addListenerToDetailsBtn(resultsBlock)
                createPagination(res.data.totalResults)
                addListenerToPaginationItems()
            }
        })
        .catch(() => {
            let resultsBlock = document.getElementById('search-results');
            if(!resultsBlock) {
                return;
            }
            
            resultsBlock.innerHTML = 'Error!'
        })
}

function createFilmItem(item) {
    console.log(item)
    let el = document.createElement('div'),
        elTitle = document.createElement('h4'),
        elYear = document.createElement('div'),
        elButton = document.createElement('span'),
        elPoster = document.createElement('img');

    elPoster.src = item.Poster
    
    el.classList.add('film-item')
    elTitle.classList.add('film-item__title')
    elYear.classList.add('film-item__year')
    elButton.classList.add('film-item__btn')
    elPoster.classList.add('film-item__poster')


    elTitle.innerHTML = "Name: " + item.Title                            
    elYear.innerHTML = "Year: " + item.Year ?? "-"                        
    elButton.innerHTML = "Details"
    

    el.append(elTitle)
    el.append(elYear)
    el.append(elButton)
    el.append(elPoster)

    return el
}

function createPagination(amount) {
    let ul = document.getElementById('search-pagination');
    ul.classList.add('pagination')
    if(!ul) {
        return;
    }

    ul.innerHTML = '';

    for(let i = 0; i < amount / 10; i++) {
        let el = document.createElement('li');
        el.innerHTML = i + 1

        ul.append(el)

    }
}

function addListenerToPaginationItems() {
    let ulItems = document.querySelectorAll('#search-pagination li'),
        form = document.getElementById('search-form');

    if(ulItems.length === 0) {
        return;
    }

    ulItems.forEach(item => {
        item.addEventListener('click', (e) => {
            findFilms(e.target.innerText, form)
            if(e.target.innerText === page){
                return;
            }
        })
    });
}

function addListenerToDetailsBtn(block) {
    let detailsBtns = block.querySelectorAll('.film-item__btn');

    if(detailsBtns.length === 0) {
        return;
    }

    detailsBtns.forEach(btn => btn.addEventListener('click', showFilmDetails))
}

function showFilmDetails(e) {
    console.log(e.target.closest('.film-item'))
}