'use strict';

/**
 *
 * @param from{string}
 * @param to{string}
 * @param utcBank
 * @returns {*}
 */
function parseDay(from, to, utcBank) {
    let fromMinutes = Number(from.substr(3, 2)) * 60 + Number(from.substr(6, 2));
    let toMinutes = Number(to.substr(3, 2)) * 60 + Number(to.substr(6, 2));
    let utcTime = Number(from.substr(9));
    fromMinutes += (utcBank - utcTime) * 60;
    toMinutes += (utcBank - utcTime) * 60;
    let ans = {};
    switch (from.substr(0, 2)) {
        case "ПН":
            ans.day = "MON";
            break;
        case "ВТ":
            ans.day = "TUE";
            break;
        case "СР":
            ans.day = "WED";
            break;
        default:
            ans.day = "NOT";
    }
    switch (to.substr(0, 2)) {
        case "ПН":
            ans.dayTo = "MON";
            break;
        case "ВТ":
            ans.dayTo = "TUE";
            break;
        case "СР":
            ans.dayTo = "WED";
            break;
        default:
            ans.dayTo = "NOT";
    }
    ans.from = fromMinutes;
    ans.to = toMinutes;
    return ans;
}

/**
 * @param {Object} schedule Расписание Банды
 * @param {number} duration Время на ограбление в минутах
 * @param {Object} workingHours Время работы банка
 * @param {string} workingHours.from Время открытия, например, "10:00+5"
 * @param {string} workingHours.to Время закрытия, например, "18:00+5"
 * @returns {Object}
 */
function getAppropriateMoment(schedule, duration, workingHours) {
    let fromBankMinutes = Number(workingHours.from.substr(0, 2)) * 60 + Number(workingHours.from.substr(3, 2));
    let toBankMinutes = Number(workingHours.to.substr(0, 2)) * 60 + Number(workingHours.to.substr(3, 2));
    let utcBank = Number(workingHours.from.substr(6));
    let busyDates = {"MON": [], "TUE": [], "WED": []};
    Object.keys(schedule).forEach(function (name) {
        schedule[name].forEach(function (pair) {
            let parsed = parseDay(pair.from, pair.to, utcBank);
            if (parsed.day !== "NOT" && parsed.day === parsed.dayTo) {
                busyDates[parsed.day].push({"from": parsed.from, "to": parsed.to});
            }
            if (parsed.day !== parsed.dayTo) {
                if (parsed.day !== "NOT") {
                    busyDates[parsed.day].push({"from": parsed.from, "to": 23 * 60 + 59});
                }
                if (parsed.dayTo !== "NOT") {
                    busyDates[parsed.dayTo].push({"from": 0, "to": parsed.to});
                }
            }
        })
    });
    let ans = [];

    Object.keys(busyDates).forEach(function (day) {
        let from = fromBankMinutes;
        for (let to = from + duration; to <= toBankMinutes; to++, from++) {

            let flag = true;
            busyDates[day].forEach(function (pair) {
                if (!((to <= pair.from) || (from >= pair.to))) {
                    flag = false;
                }
            });
            if (flag) {
                ans.push({"day": day, "from": from, "to": to});
            }
        }
    });

    let numBestDay = 0;
    return {
        /**
         * Найдено ли время
         * @returns {boolean}
         */
        exists() {
            return ans.length !== 0; //Object.keys(ans["MON"]).length + Object.keys(ans["TUE"]).length + Object.keys(ans["WED"]).length !== 0;
        },

        /**
         * Возвращает отформатированную строку с часами
         * для ограбления во временной зоне банка
         *
         * @param {string} template
         * @returns {string}
         *
         * @example
         * ```js
         * getAppropriateMoment(...).format('Начинаем в %HH:%MM (%DD)') // => Начинаем в 14:59 (СР)
         * ```
         */
        format(template) {
            let answer = "";
            let flag = ans.length !== 0;
            if (flag) {
                answer = template;
                switch (ans[numBestDay].day) {
                    case "MON":
                        answer = template.replace("%DD", "ПН");
                        break;
                    case "TUE":
                        answer = template.replace("%DD", "ВТ");
                        break;
                    case "WED":
                        answer = template.replace("%DD", "СР");
                        break;
                }
                if (Math.floor(ans[numBestDay].from / 60) > 9) {
                    answer = answer.replace("%HH", (Math.floor(ans[numBestDay].from / 60)).toString());
                } else {
                    answer = answer.replace("%HH", "0" + (Math.floor(ans[numBestDay].from / 60)).toString());
                }
                if (ans[numBestDay].from % 60 > 9) {
                    answer = answer.replace("%MM", (ans[numBestDay].from % 60).toString());
                } else {
                    answer = answer.replace("%MM", "0" + (ans[numBestDay].from % 60).toString());
                }
            }
            return answer;
        },

        /**
         * Попробовать найти часы для ограбления позже [*]
         * @note Не забудь при реализации выставить флаг `isExtraTaskSolved`
         * @returns {boolean}
         */
        tryLater() {
            for (let i = numBestDay; i < ans.length; i++) {
                if (ans[numBestDay].from + 30 <= ans[i].from) {
                    numBestDay = i;
                    return true;
                }
                if (ans[numBestDay].day !== ans[i].day) {
                    numBestDay = i;
                    return true;
                }
            }
            return false;
        }
    };
}

let isExtraTaskSolved = true;

module.exports = {
    getAppropriateMoment,
    isExtraTaskSolved
};
