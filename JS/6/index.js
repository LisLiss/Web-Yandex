function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

function clearSuggestions() {
    document.getElementsByClassName("search-suggest")[0].style.display = "none";
    let len = document.getElementsByClassName("search-suggest__button").length
    while (len !== 0) {
        document.getElementsByClassName("search-suggest__button").item(0).remove();
        len--;
    }
}

function addCity(city, ind) {
    let buttonCity = document.createElement("button");
    buttonCity.className = "search-suggest__button";
    buttonCity.textContent = `${city.city_name}, ${city.code}`;
    buttonCity.id = ind;
    buttonCity.onclick = () => {
        document.getElementsByClassName("search-form__input")[0].value = `${city.city_name}, ${city.code}`;
        clearSuggestions();
        document.getElementsByClassName("search-form-button__button")[0].focus();
    }

    buttonCity.onkeypress = onKeyPressButton;
    buttonCity.onkeydown = onKeyButton;

    document.getElementsByClassName("search-suggest")[0].appendChild(buttonCity);
}

function onKeyPressButton(context) {
    switch (context.key) {
        case "Enter":
            document.getElementsByClassName("search-form__input")[0].value = document.getElementsByClassName("search-suggest__button")[parseInt(context.target.id)].innerText;
            clearSuggestions();
            document.getElementsByClassName("search-form-button__button")[0].focus();
            break;
    }
}

function onKeyButton(context) {
    let len = document.getElementsByClassName("search-suggest__button").length;
    switch (context.key) {
        case "ArrowDown":
            document.getElementsByClassName("search-suggest__button")[(parseInt(context.target.id) + 1 + len) % len].focus();
            break;
        case "ArrowUp":
            document.getElementsByClassName("search-suggest__button")[(parseInt(context.target.id) - 1 + len) % len].focus();
            break;
        case "Enter":
            break;
        default:
            document.getElementsByClassName("search-form__input")[0].focus();
    }
}

function onKeyInput(context) {
    switch (context.key) {
        case "ArrowDown":
            document.getElementsByClassName("search-suggest__button")[0].focus();
            break;
        case "ArrowUp":
            document.getElementsByClassName("search-suggest__button")[document.getElementsByClassName("search-suggest__button").length - 1].focus();
            break;
    }
}

document.getElementsByClassName("search-form__input")[0].onkeydown = onKeyInput;

let checkInput = debounce(checkInputForDebounce, 200)

async function checkInputForDebounce() {
    clearSuggestions();
    let inp = document.getElementsByClassName("search-form__input")[0].value;
    if (inp !== "") {
        let ans = await fetch(`https://autocomplete.travelpayouts.com/places2?term=${inp}&locale=ru&types[]=airport`);
        if (ans.ok) {
            let parsed = await ans.json();
            let city = parsed;
            if (parsed.length > 5) {
                city = parsed.slice(0, 5);
            }
            if (city.length > 0) {
                document.getElementsByClassName("search-suggest")[0].style.display = "flex";
            }
            city.forEach((x, ind) => addCity(x, ind))
        }
    }
}