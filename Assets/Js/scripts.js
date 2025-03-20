const SWAPI_ROOT = "https://swapi.py4e.com/api";
var currentPage = 1;
const characterContainer = document.getElementById("character-container");


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
    if (currentPage < 9) {
        currentPage += 1;
        openPage(currentPage);
    }
}

function openPage(page) {
    if (page > 0 && page < 10) {
        currentPage = page;
        document.querySelector(".active").classList.remove("active");
        document.querySelector(`.p${page}`).classList.add("active");
        request(SWAPI_ROOT + `/people/?page=${page}`, populateCharacterContainer);
    }
}

request(SWAPI_ROOT + "/people/", populateCharacterContainer);

document.querySelectorAll(".page").forEach(e => {
    e.addEventListener("click", () => openPage(Number(e.textContent)));
    console.log(e.textContent);
});

document.querySelector(".prev").addEventListener("click", prevPage);

document.querySelector(".next").addEventListener("click", nextPage);



