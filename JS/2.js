'use strict';

/**
 * Телефонная книга
 */
const phoneBook = new Map();

function escapeRegex(string) {
    return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

/**
 * Вызывайте эту функцию, если есть синтаксическая ошибка в запросе
 * @param {number} lineNumber – номер строки с ошибкой
 * @param {number} charNumber – номер символа, с которого запрос стал ошибочным
 */
function syntaxError(lineNumber, charNumber) {
    throw new Error(`SyntaxError: Unexpected token at ${lineNumber}:${charNumber}`);
}

/**
 * Создает новый контакт с именем tmpName с пустыми списками телефонов и почт
 * Не создает ничего, если контакт уже существует
 * @param {string} tmpName Принимает <имя> содержащее любые символы, кроме ;
 */
function addContact(tmpName) {
    if (phoneBook.has(tmpName)) {
        return;
    }
    let contact = {
        emails: new Set(),
        phones: new Set()
    }
    phoneBook.set(tmpName, contact);
}

/**
 * Удаляет контакт с именем <имя>
 * Не удаляет ничего, если контакт не существует
 * @param {string} tmpName Принимает <имя> содержащее любые символы, кроме ;
 */
function delContact(tmpName) {
    if (phoneBook.has(tmpName)) {
        phoneBook.delete(tmpName);
    }
}

/**
 * Добавляет <телефон> в спискок телефонов и <почту> в список почт для контакта <имя>
 * Принимает произвольное количество почт и телефонов, перечисленных через и
 * Не добавляет ничего, если контакт не существует
 * Не добавляет почту/телефон, если такая почта/телефон уже есть у контакта
 * @param {string} tmpName
 * @param phones {string[]} Принимает телефоны только в формате 5556667788 (без кода), иначе это считается ошибкой синтаксиса
 * @param emails {string[]} Принимает почты без пробелов, поэтому через пробел ожидается следующее слово
 */
function addTelEmail(tmpName, phones, emails) {
    if (!phoneBook.has(tmpName)) {
        return;
    }
    phones.forEach(x => phoneBook.get(tmpName).phones.add(x));
    emails.forEach(x => phoneBook.get(tmpName).emails.add(x));
}

/**
 * Удаляет <телефон> из списка телефонов и <почту> из списка почт контакта <имя>
 * Принимает произвольное количество почт и телефонов, перечисленных через и
 * Не удаляет ничего, если контакт не существует
 * Не удаляет почту/телефон, если такая почта/телефон отсутствует у контакта
 * @param tmpName {string}
 * @param phones {string[]} Принимает телефоны только в формате 5556667788 (без кода), иначе это считается ошибкой синтаксиса
 * @param emails {string[]} Принимает почты без пробелов, иначе это считается ошибкой синтаксиса
 */
function delTelEmail(tmpName, phones, emails) {
    if (!phoneBook.has(tmpName)) {
        return;
    }
    phones.forEach(x => phoneBook.get(tmpName).phones.delete(x));
    emails.forEach(x => phoneBook.get(tmpName).emails.delete(x));
}

/**
 * Показывает info (телефон, почта, имя) по имени
 * @param tmpName - корректное, существующее
 * @param info "tel", "email", "name" - что показать
 * @returns  - строки с результатами запроса
 */
function showInfoByName(tmpName, info) {
    switch (info) {
        case "tel":
            return phoneBook.get(tmpName).phones;
        case "email":
            return phoneBook.get(tmpName).emails;
        case "name":
            return tmpName;
    }
}

/**
 * риводит номер телефона в вид +7 (555) 666-77-88
 * @param tel {string} номер телефона в виде 555667788
 */
function showTel(tel) {
    return "+7 (" + tel[0] + tel[1] + tel[2] + ") " + tel[3] + tel[4] + tel[5] + "-" + tel[6] + tel[7] + "-" + tel[8] + tel[9]
}

function showWithDesign(tmpName, info) {
    let data = showInfoByName(tmpName, info);
    let ans = "";
    switch (info) {
        case "tel":
            data.forEach(function (x) {
                ans += showTel(x);
                ans += ',';
            })
            ans = ans.substr(0, ans.length - 1) + ";";
            break;
        case "email":
            data.forEach(function (x) {
                ans += x;
                ans += ',';
            })
            ans = ans.substr(0, ans.length - 1) + ";";
            break;
        case "name":
            ans += data;
            ans += ";";
    }
    return ans;
}


/**
 * Ищет вхождение <запрос> хотя бы в один из телефонов, либо в одну из почт, либо в имя контакта
 * Принимает для перечисления произвольное количество типов полей, перечисленных через и, среди которых могут быть имя, почты и телефоны
 * Возвращает список строк в формате <почта 1>,<почта 2>;<телефон 1> в соответствии с запращиваемыми полями, для подходящих под запрос контактов
 * Возвращает контакты в порядке создания, а их почты/телефоны в порядке добавления
 * Возвращает имена и электронные почты как есть, а телефоны в виде +7 (555) 666-77-88
 * Не возвращает ничего на пустой запрос
 * @param query {string} Принимает <запрос> содержащий любые символы, кроме ;
 * @param info {string[]} информация для show
 * @returns {string []} - строки с результатами запроса
 */
function showByQuery(query, info) {
    if (query === "") {
        return [];
    }
    let regQuery = new RegExp(escapeRegex(query));
    let ansArray = [];
    phoneBook.forEach(function (data, name) {
        let flag = regQuery.test(name);
        data.phones.forEach(function (tel) {
            flag = flag || regQuery.test(String(tel));
        });
        data.emails.forEach(function (email) {
            flag = flag || regQuery.test(String(email));
        });
        if (!flag) return;
        let ans = "";
        for (let i = 0; i < info.length; i++) {
            ans += showWithDesign(name, info[i]);
        }
        ansArray.push(ans.substr(0, ans.length - 1));
    })
    return ansArray;
}

function delByQuery(query) {
    if (query !== "") {
        let regQuery = new RegExp(escapeRegex(query));
        phoneBook.forEach(function (data, name) {
            let flag = regQuery.test(name);
            data.phones.forEach(function (tel) {
                flag = flag || regQuery.test(String(tel));
            });
            data.emails.forEach(function (email) {
                flag = flag || regQuery.test(String(email));
            });
            if (!flag) return;
            delContact(name);
        })
    }
}

/**
 * Выполнение запроса на языке pbQL
 * @param {string} queryGiven
 * @returns {string[]} - строки с результатами запроса
 */
function run(queryGiven) {
    let answer = [];
    let querySeparated = queryGiven.split(';');
    for (let i = 0; i < querySeparated.length - 1; i++) {
        let query = querySeparated[i].split(" ");
        switch (query[0]) {
            case "Создай":
                if (query[1] === "контакт") {
                    addContact(query.slice(2).join(" "));
                } else {
                    syntaxError(i + 1, 8);
                }
                break;
            case "Удали":
                switch (query[1]) {
                    case "контакт":
                        delContact(query.slice(2).join(" "))
                        break;
                    case "контакты,":
                        if (query[2] === "где") {
                            if (query[3] === "есть") {
                                delByQuery(query.slice(4).join(" "));
                            } else {
                                syntaxError(i + 1, 21);
                            }
                        } else {
                            syntaxError(i + 1, 17);
                        }
                        break;
                    case "телефон":
                    case "почту":
                        let tels = [];
                        let emails = [];
                        let ind = 1;
                        while (true) {
                            let flag = false;
                            switch (query[ind]) {
                                case "телефон":
                                    if (/^[0-9]{10}$/.test(query[ind + 1])) {
                                        tels.push(query[ind + 1]);
                                        ind += 2;
                                    } else {
                                        syntaxError(i + 1, query.slice(0, ind + 1).join(" ").length + 2);
                                    }
                                    break;
                                case "почту":
                                    emails.push(query[ind + 1]);
                                    ind += 2;
                                    break;
                                case "и":
                                    ind++;
                                    break;
                                case "для":
                                    flag = true;
                                    break;
                                default:
                                    syntaxError(i + 1, query.slice(0, ind).join(" ").length + 2);
                            }
                            if (flag) break;
                        }
                        ind++;
                        if (query[ind] === "контакта") {
                            delTelEmail(query.slice(ind + 1).join(" "), tels, emails);
                        } else {
                            syntaxError(i + 1, query.slice(0, ind).join(" ").length + 2);
                        }
                        break;
                    default:
                        syntaxError(i + 1, 7);
                }
                break;
            case "Добавь":
                switch (query[1]) {
                    case "телефон":
                    case "почту":
                        let tels = [];
                        let emails = [];
                        let ind = 1;
                        while (true) {
                            let flag = false;
                            switch (query[ind]) {
                                case "телефон":
                                    if (/^[0-9]{10}$/.test(query[ind + 1])) {
                                        tels.push(query[ind + 1]);
                                        ind += 2;
                                    } else {
                                        syntaxError(i + 1, query.slice(0, ind + 1).join(" ").length + 2);
                                    }
                                    break;
                                case "почту":
                                    emails.push(query[ind + 1]);
                                    ind += 2;
                                    break;
                                case "и":
                                    ind++;
                                    break;
                                case "для":
                                    flag = true;
                                    break;
                                default:
                                    syntaxError(i + 1, query.slice(0, ind).join(" ").length + 2);
                            }
                            if (flag) break;
                        }
                        ind++;
                        if (query[ind] === "контакта") {
                            addTelEmail(query.slice(ind + 1).join(" "), tels, emails);
                        } else {
                            syntaxError(i + 1, query.slice(0, ind).join(" ").length + 2);
                        }
                        break;
                    default:
                        syntaxError(i + 1, 8);
                }
                break;
            case "Покажи":
                switch (query[1]) {
                    case "телефоны":
                    case "почты":
                    case "имя":
                        let info = [];
                        let ind = 1;
                        while (true) {
                            let flag = false;
                            switch (query[ind]) {
                                case "телефоны":
                                    info.push("tel");
                                    ind++;
                                    break;
                                case "почты":
                                    info.push("email");
                                    ind++;
                                    break;
                                case "имя":
                                    info.push("name");
                                    ind++;
                                    break;
                                case "и":
                                    ind++;
                                    break;
                                case "для":
                                    flag = true;
                                    break;
                                default:
                                    syntaxError(i + 1, query.slice(0, ind).join(" ").length + 2);
                            }
                            if (flag) break;
                        }
                        ind++;
                        if (query[ind] === "контактов,") {
                            if (query[ind + 1] === "где") {
                                if (query[ind + 2] === "есть") {
                                    answer = answer.concat(showByQuery(query.slice(ind + 3).join(" "), info));
                                } else {
                                    syntaxError(i + 1, query.slice(0, ind + 2).join(" ").length + 2);
                                }
                            } else {
                                syntaxError(i + 1, query.slice(0, ind + 1).join(" ").length + 2);
                            }
                        } else {
                            syntaxError(i + 1, query.slice(0, ind).join(" ").length + 2);
                        }
                        break;
                    default:
                        syntaxError(i + 1, 8);
                }
                break;
            default:
                syntaxError(i + 1, 1);
        }
    }
    if (querySeparated[querySeparated.length-1] !== ""){
        syntaxError(querySeparated.length, querySeparated[querySeparated.length-1].length + 1);
    }
    return answer;
}

module.exports = {phoneBook, run};