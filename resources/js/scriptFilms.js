//Количество загружаемых фильмов за раз
const FILMS_COUNT = 15;

//фильмы из JSON файла
var filmsJSON;
//теги из JSON файла
var tagsJSON;
//блок всех тегов
var tagsElement;
//выбранные теги
var markerTags;
//подходящие по критериям фильмы
var films;
//поле ввода названия фильма
var inputElement;
//блок подходящих фильмов
var foundedFilmsElement;
//Кнопка показать еще
var showMoreButtonElement
//Текст по найденным фильмам
var foundedFilmsLabelElement;

document.onload = loadPage();

//загрузка всех тегов  и присвоение переменных
function loadPage() {
    filmsJSON = getDataFromJSON("resources/jsons/films.json");
    tagsJSON = getDataFromJSON("resources/jsons/tags.json");

    tagsElement = document.getElementById("tags");
    markerTags = new Set();
    films = [];
    input = document.getElementById("filmInput");
    foundedFilmsElement = document.getElementById("foundedFilms")
    showMoreButtonElement = document.getElementById("showMoreButton");
    foundedFilmsLabelElement = document.getElementById("foundedFilmsLabel")


    for (let i = 0; i < tagsJSON.length; i++) {
        const tag = document.createElement('button');
        tag.className = 'tag col-5 col-sm-3';
        tag.innerHTML = tagsJSON[i];
        tagsElement.appendChild(tag);
    }
}

// Поиск фильмов по тегам
function onClickTag(event) {
    const target = event.target;

    if (target.tagName == 'BUTTON') {
        target.classList.toggle('greybg');

        if (!markerTags.has(target.innerHTML)) {
            markerTags.add(target.innerHTML);
        } else {
            markerTags.delete(target.innerHTML);
        }

        searchFilms();
    }
}

//Поиск фильмов по введеным значениям
function searchFilms() {
    //Введенное название фильма
    const inputText = input.value;
    films = [];

    if ((inputText != "") || ( markerTags.size > 0)) {
        for (let i = 0; i < filmsJSON.length; i++) {
            //Подошёл ли фильм по тегам
            let isFitByParams = false;

            //проверка по введеному названию
            if ((filmsJSON[i].title.toUpperCase().indexOf(inputText.toUpperCase()) != -1)) {
                //проверка по выбранным тегам
                if (markerTags.size > 0 ) {
                    for (let j = 0; j < filmsJSON[i].tags.length; j++) {
                        if (markerTags.has(filmsJSON[i].tags[j])) {
                            isFitByParams = true;
                            break;
                        }
                    }
                } else {
                    isFitByParams = true;
                }
            }

            if (isFitByParams) {
                films.push(filmsJSON[i].title);
            }
        }
    }

    foundedFilmsElement.innerHTML = "";
    showMoreButtonElement.style.display = "none";

    //если параметров нет
    if (inputText == "" && markerTags.size == 0) {
        foundedFilmsLabelElement.innerHTML = "Выберите параметры для поиска фильмов";
    } else {
        //по параметрам фильмы нашлись
        if (films.length > 0) {
            foundedFilmsLabelElement.innerHTML = "Найденные фильмы";
            loadFilms(0);
        } else {
            foundedFilmsLabelElement.innerHTML = "По выбранным критериям фильмов не найдено";
        }
    }
}

// Загрузка списка фильмов из найденных фильмов, начиная с номера startNumber
function loadFilms(startNumber) {
    for (let i = startNumber; i < FILMS_COUNT + startNumber; i++){
        if (i <= films.length - 1 ) {
            let filmElement = document.createElement('div');
            filmElement.className = 'film container-fluid';

            let rowElement = document.createElement('div');
            rowElement.className = 'row';

            let filmNameElement = document.createElement('div');
            filmNameElement.className = 'film-name col-7';
            filmNameElement.innerHTML = films[i];

            let starElement = document.createElement('button');
            starElement.className="marker col-1";
            if (localStorage.getItem(films[i]) != null) {
                starElement.innerHTML = '&#9733;';
            } else {
                starElement.innerHTML = '&#9734;'
            }

            rowElement.appendChild(filmNameElement);
            rowElement.appendChild(starElement);
            filmElement.appendChild(rowElement);
            foundedFilmsElement.appendChild(filmElement);
        }
        else {
            break;
        }
    }

    if (foundedFilmsElement.childElementCount >= films.length) {
        showMoreButtonElement.style.display = "none";
    } else {
        showMoreButtonElement.style.display = "block";
    }
}

// Обработка для кнопки "Показать ещё"
function showMore() {
    loadFilms(foundedFilmsElement.childElementCount, films);
}

//Обработка добаления/удаления фильмы в закладки
function clickOnStar(event) {
    const target = event.target;
    let currentFilmName = target.parentNode.firstElementChild.innerHTML;

    if (target.tagName == 'BUTTON') {
        if (localStorage.getItem(currentFilmName) != null)  {
            target.innerHTML = '&#9734;';
            localStorage.removeItem(currentFilmName);
        } else {
            target.innerHTML = '&#9733;';
            localStorage.setItem(currentFilmName,"");
        }
    }
}

//Считывание данных из файла
function getDataFromJSON(path) {
  let xhr = new XMLHttpRequest();
  xhr.open('GET', path, false);
  xhr.send();
  if (xhr.status != 200) {
    console.log( xhr.status + ': ' + xhr.statusText );
  } else {
    return JSON.parse(xhr.responseText);
  }
}
