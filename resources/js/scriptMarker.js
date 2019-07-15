//Количество загружаемых фильмов за раз
const FILMS_COUNT = 15;
//Текст по фильмам в закладках
var markerFilmsLabelElement;
//блок показанных фильмов
var markerFilmsElement;
//кнопка показать ещё
var showMoreButtonElement;

document.onload = loadPage();

//загрузка первых пятнадцати фильмов из закладок  и определение переменных
function loadPage() {
    markerFilmsLabelElement = document.getElementById("markerFilmsLabel");
    markerFilmsElement = document.getElementById("markerFilms");
    showMoreButtonElement = document.getElementById("showMoreButton");

    if (localStorage.length == 0) {
        markerFilmsLabelElement.style.display = "block";
    } else {
        loadFilms(0);
    }
}

// Загрузка фильмов из закладок с номера startNumber
function loadFilms(startNumber) {
    for (let i = startNumber; i < FILMS_COUNT + startNumber; i++){
        if (i <= localStorage.length - 1 ) {
            markerFilmsElement.appendChild(createMarkFilmElement(localStorage.key(i)));
        }
        else {
            break;
        }
    }

    if (markerFilmsElement.childElementCount == localStorage.length) {
        showMoreButtonElement.style.display = "none";
    } else {
        showMoreButtonElement.style.display = "block";
    }
}

// Обработка для кнопки "Показать ещё"
function showMore() {
    loadFilms(markerFilmsElement.childElementCount);
}

//Обработка удалений фильмов из закладок
function clickOnStar(event) {
    const target = event.target;

    if (target.tagName == 'BUTTON') {
        deleteMark(target);
    }
}

//удаление из закладок
function deleteMark(target) {
    const currentFilm = target.parentNode.parentNode;
    const currentFilmName = target.parentNode.firstElementChild.innerHTML;
    const loadedMarkerFilmsCount = markerFilmsElement.childElementCount;

    if (localStorage.length  > loadedMarkerFilmsCount) {
        markerFilmsElement.appendChild(createMarkFilmElement(localStorage.key(loadedMarkerFilmsCount)));

        if (localStorage.length - 1 <= loadedMarkerFilmsCount) {
            showMoreButtonElement.style.display = "none";
        }
    }

    markerFilmsElement.removeChild(currentFilm);
    localStorage.removeItem(currentFilmName);

    if (localStorage.length == 0) {
        markerFilmsLabelElement.style.display = "block";
    } else {
        markerFilmsLabelElement.style.display = "none"
    }
}

//Создание элемента фильм
function createMarkFilmElement(filmName) {
  let filmElement = document.createElement('div');
  filmElement.className = 'film container-fluid';

  let rowElement = document.createElement('div');
  rowElement.className = 'row';

  let filmNameElement = document.createElement('div');
  filmNameElement.className = 'film-name col-7';
  filmNameElement.innerHTML = filmName;

  let starElement = document.createElement('button');
  starElement.className="marker col-1";
  starElement.innerHTML = '&#9733;';

  rowElement.appendChild(filmNameElement);
  rowElement.appendChild(starElement);
  filmElement.appendChild(rowElement);

  return filmElement;
}
