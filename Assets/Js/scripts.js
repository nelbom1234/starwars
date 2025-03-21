const SWAPI_ROOT = "https://swapi.py4e.com/api";
var searchRequest = "/people/?search="
var currentPage = 1;
var pages = 9;
const characterContainer = document.getElementById("character-container");
const planetContainer = document.getElementById("planet-container");
const filmContainer = document.getElementById("film-container");
const modal = document.getElementById("modal");


function request(url, cb) {
    return fetch(url)
        .then(function (res) {
            return res.json();
        })
        .then (function (data) {
            if (typeof cb === "function") {
                cb(data);
            }

            return data;
        })
        .catch(function (err) {
            console.log(err);
        })
}

function populateCharacterContainer(data) {
    flushCharacters();
    data.results.forEach((character, index) => {
        characterContainer.innerHTML += 
            `<div class="character">
                <p>${character.name}</p>
                <p>${character.height}</p>
                <p>${character.birth_year}</p>
                <p>${character.gender}</p>
            </div>
            `;
    });
    Pagination(data.count);
}

function flushCharacters() {
    document.querySelectorAll(".character").forEach(e => e.remove());
}

function prevPage() {
    if (currentPage > 1) {
        currentPage -= 1;
        openPage(currentPage);
    }
}

function nextPage() {
    if (currentPage <= pages) {
        currentPage += 1;
        openPage(currentPage);
    }
}

function openPage(page) {
    if (page > 0 && page <= pages) {
        currentPage = page;
        document.querySelector(".active").classList.remove("active");
        document.querySelector(`.p${page}`).classList.add("active");
        request(SWAPI_ROOT + searchRequest + `&page=${page}`, populateCharacterContainer);
    }
}

function Search(name) {
    var search = document.getElementById("search");
    searchRequest = "/people/?search=" + search.value;
    request(SWAPI_ROOT + searchRequest, populateCharacterContainer);
    openPage(1);
}

function Pagination(count) {
    pages = Math.ceil((count)/10);
    for (let i = 1; i < pages+1; i++) {
        document.querySelectorAll(".page").forEach(e => {
            if (Number(e.textContent) < pages+1) {
                e.hidden = false;
            }
            else {
                e.hidden = true;
            }
        });
    }
}

function populatePlanetContainer(data) {
    data.results.forEach((planet, index) => {
        planetContainer.innerHTML += 
            `<div class="planet">
                <p>${planet.name}</p>
                <p>${planet.population}</p>
                <p class="climate-value">${planet.climate}</p>
                <p>${planet.terrain}</p>
            </div>
            `;
    });
    if (data.next !== null) {
        request(data.next, populatePlanetContainer)
    }
}

function populateFilmContainer(data) {
    data.results.forEach((film, index) => {
        filmContainer.innerHTML +=
        `<div class="film">
            <p>${film.title}</p>
            <p>${film.release_date}</p>
            <button id="modal${index}" class="modalbutton" onclick="openModal" data-arg1="${film.opening_crawl}">Show</button>
        </div>`
        
    })
}

request(SWAPI_ROOT + "/people/", populateCharacterContainer);
request(SWAPI_ROOT + "/planets/", populatePlanetContainer);
request(SWAPI_ROOT + "/films/", populateFilmContainer);


document.querySelectorAll(".page").forEach(e => {
    e.addEventListener("click", () => openPage(Number(e.textContent)));
});

document.querySelector(".prev").addEventListener("click", prevPage);

document.querySelector(".next").addEventListener("click", nextPage);

document.getElementById("climate").addEventListener("change", (event) => {
    document.querySelectorAll(".planet").forEach(e => {
        if (e.innerHTML.includes(event.target.value)) {
            e.hidden = false;
            console.log(e.hidden);
            e.classList.remove("hidden");
        }
        else {
            e.hidden = true;
            console.log(e.hidden);
            e.classList.add("hidden");
        }
    })
})

openModal = (event) => {
    modal.style.display = "block";
    document.querySelector(".modal-text").textContent = event.target.getAttribute('data-arg1')
    console.log("test");
}

// document.querySelectorAll(".modalbutton").forEach(e => {
//     e.onclick = function() {
//         modal.style.display = "block";
//         modal.textContent = e.value;
//         console.log("test");
//     };
// })

document.querySelector(".close").onclick = function() {
    modal.style.display("none");
}
