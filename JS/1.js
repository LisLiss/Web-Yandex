'use strict';

/**
 * Складывает два целых числа
 * @param {Number} a Первое целое
 * @param {Number} b Второе целое
 * @throws {TypeError} Когда в аргументы переданы не числа
 * @returns {Number} Сумма аргументов
 */
function abProblem(a, b) {
    if (Number.isInteger(a) && Number.isInteger(b)) {
        return a + b;
    } else {
        throw new TypeError("a and b is not integer");
    }
}

/**
 * Определяет век по году
 * @param {Number} year Год, целое положительное число
 * @throws {TypeError} Когда в качестве года передано не число
 * @throws {RangeError} Когда год – отрицательное значение
 * @returns {Number} Век, полученный из года
 */
function centuryByYearProblem(year) {
    if (Number.isInteger(year)) {
        if (year < 0) {
            throw new RangeError("year is negative");
        } else {
            return Math.ceil(year / 100);
        }
    } else {
        throw new TypeError("year is not integer");
    }
}

function charToNum(a) {
    if (a >= '0' && a <= '9') {
        return a - '0';
    } else {
        a = a.toUpperCase();
        if (a >= 'A' && a <= "F") {
            return a.charCodeAt(0) - 'A'.charCodeAt(0) + 10;
        } else {
            return -1;
        }
    }
}

function hexToNum(a, b) {
    a = charToNum(a);
    b = charToNum(b);
    if (a > -1 && b > -1) {
        return a * 16 + b;
    } else {
        return -1;
    }
}

/**
 * Переводит цвет из формата HEX в формат RGB
 * @param {String} hexColor Цвет в формате HEX, например, '#FFFFFF'
 * @throws {TypeError} Когда цвет передан не строкой
 * @throws {RangeError} Когда значения цвета выходят за пределы допустимых
 * @returns {String} Цвет в формате RGB, например, '(255, 255, 255)'
 */
function colorsProblem(hexColor) {
    if (typeof hexColor === "string") {
        if (hexColor[0] !== '#'){
            throw new RangeError("It is not hex Color");
        }
        if (hexColor.length === 7) {
            let firstNum = hexToNum(hexColor[1], hexColor[2]);
            let secondNum = hexToNum(hexColor[3], hexColor[4]);
            let thirdNum = hexToNum(hexColor[5], hexColor[6]);
            if (firstNum > -1 && secondNum > -1 && thirdNum > -1) {
                return "(" + firstNum + ", " + secondNum + ", " + thirdNum + ")";
            } else {
                throw new RangeError("It is not hex Color");
            }
        } else {
            if (hexColor.length === 4) {
                let firstNum = hexToNum(hexColor[1], hexColor[1]);
                let secondNum = hexToNum(hexColor[2], hexColor[2]);
                let thirdNum = hexToNum(hexColor[3], hexColor[3]);
                if (firstNum > -1 && secondNum > -1 && thirdNum > -1) {
                    return "(" + firstNum + ", " + secondNum + ", " + thirdNum + ")";
                } else {
                    throw new RangeError("It is not hex Color");
                }
            } else {
                throw new RangeError("It is not hex Color");
            }
        }
    } else {
        throw new TypeError("hexColor is not string");
    }
}

/**
 * Находит n-ое число Фибоначчи
 * @param {Number} n Положение числа в ряде Фибоначчи
 * @throws {TypeError} Когда в качестве положения в ряде передано не число
 * @throws {RangeError} Когда положение в ряде не является целым положительным числом
 * @returns {Number} Число Фибоначчи, находящееся на n-ой позиции
 */
function fibonacciProblem(n) {
    if (typeof n === "number") {
        if (Number.isInteger(n)) {
            if (n <= 0) {
                throw new RangeError("n is negative");
            }
            if (n === 1 || n === 2) {
                return 1;
            }
            let a = 1, b = 1;
            for (let i = 3; i <= n; i++) {
                let help = b;
                b += a;
                a = help;
            }
            return b;
        } else {
            throw new RangeError("n is not integer");
        }
    } else {
        throw new TypeError("n is not a number");
    }
}

/**
 * Транспонирует матрицу
 * @param {(Any[])[]} matrix Матрица размерности MxN
 * @throws {TypeError} Когда в функцию передаётся не двумерный массив
 * @returns {(Any[])[]} Транспонированная матрица размера NxM
 */
function matrixProblem(matrix) {
    if (Array.isArray(matrix)) {
        let n = matrix.length;
        let m = matrix[0].length;
        for (let i = 0; i < n; i++) {
            if (!Array.isArray(matrix[i])) {
                throw new TypeError("matrix is not array");
            }
            if (matrix[i].length !== m) {
                throw new TypeError("matrix is not array");
            }
        }
        let ans = [];
        for (let i = 0; i < m; i++) {
            ans.push([]);
            for (let j = 0; j < n; j++) {
                ans[i].push(0);
            }
        }
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < m; j++) {
                ans[j][i] = matrix[i][j];
            }
        }
        return ans;
    } else {
        throw new TypeError("matrix is not array");
    }
}


/**
 * Переводит число в другую систему счисления
 * @param {Number} n Число для перевода в другую систему счисления
 * @param {Number} targetNs Система счисления, в которую нужно перевести (Число от 2 до 36)
 * @throws {TypeError} Когда переданы аргументы некорректного типа
 * @throws {RangeError} Когда система счисления выходит за пределы значений [2, 36]
 * @returns {String} Число n в системе счисления targetNs
 */
function numberSystemProblem(n, targetNs) {
    if (typeof n === "number" && typeof targetNs === "number") {
        if (targetNs > 36 || targetNs < 2) {
            throw new RangeError("targetNs is not in [2, 36]");
        }
        return n.toString(targetNs);
    } else {
        throw new TypeError("n and targetNs is not array");
    }
}

/**
 * Проверяет соответствие телефонного номера формату
 * @param {String} phoneNumber Номер телефона в формате '8–800–xxx–xx–xx'
 * @throws {TypeError} Когда в качестве аргумента передаётся не строка
 * @returns {Boolean} Если соответствует формату, то true, а иначе false
 */
function phoneProblem(phoneNumber) {
    if (typeof phoneNumber === "string") {
        let ans = phoneNumber.match(/^8-800-[0-9]{3}-[0-9]{2}-[0-9]{2}$/);
        return ans !== null;
    } else {
        throw new TypeError("phoneNumber is not string");
    }
}

/**
 * Определяет количество улыбающихся смайликов в строке
 * @param {String} text Строка в которой производится поиск
 * @throws {TypeError} Когда в качестве аргумента передаётся не строка
 * @returns {Number} Количество улыбающихся смайликов в строке
 */
function smilesProblem(text) {
    if (typeof text === "string") {
        let ans = text.match(/:-\)/g);
        let ans2 = text.match(/\(-:/g);
        if (ans === null) {
            if (ans2 === null) {
                return 0;
            } else {
                return ans2.length;
            }
        } else {
            if (ans2 === null) {
                return ans.length;
            } else {
                return ans.length + ans2.length;
            }
        }
    } else {
        throw new TypeError("text is not string");
    }
}

function checkTicTacToe(row) {
    for (let i = 0; i < 3; i++) {
        if (row[i] !== row[0]) {
            return 'd';
        }
    }
    return row[0];
}

/**
 * Определяет победителя в игре "Крестики-нолики"
 * Тестами гарантируются корректные аргументы.
 * @param {(('x' | 'o')[])[]} field Игровое поле 3x3 завершённой игры
 * @returns {'x' | 'o' | 'draw'} Результат игры
 */
function ticTacToeProblem(field) {
    for (let i = 0; i < 3; i++) {
        if (checkTicTacToe(field[i]) !== 'd') {
            return checkTicTacToe(field[i]);
        }
        let help = [];
        for (let j = 0; j < 3; j++) {
            help.push(field[j][i]);
        }
        if (checkTicTacToe(help) !== 'd') {
            return checkTicTacToe(help);
        }
    }
    let help = [], help2 = [];
    for (let i = 0; i < 3; i++) {
        help.push(field[i][i]);
        help2.push(field[i][2 - i]);
    }
    if (checkTicTacToe(help) !== 'd') {
        return checkTicTacToe(help);
    }
    if (checkTicTacToe(help2) !== 'd') {
        return checkTicTacToe(help2);
    }
    return "draw";
}

module.exports = {
    abProblem,
    centuryByYearProblem,
    colorsProblem,
    fibonacciProblem,
    matrixProblem,
    numberSystemProblem,
    phoneProblem,
    smilesProblem,
    ticTacToeProblem
};