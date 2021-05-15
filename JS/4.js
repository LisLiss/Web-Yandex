/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    let mapEvent = new Map();
    return {

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         */
        on: function (event, context, handler) {
            if (mapEvent.has(event)) {
                mapEvent.get(event).push({name: context, func: handler});
            } else {
                mapEvent.set(event, [{name: context, func: handler}]);
            }
            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         */
        off: function (event, context) {
            for (let ev of mapEvent.keys()) {
                if (ev.startsWith(event + '.') || ev === event) {
                    for (let i = 0; i < mapEvent.get(ev).length; i++) {
                        if (mapEvent.get(ev)[i].name === context) {
                            mapEvent.get(ev).splice(i, 1);
                        }
                    }
                }
            }
            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         */
        emit: function (event) {
            let eventSplitted = event.split(".");
            for (let i = eventSplitted.length; i > 0; i--) {
                let help = eventSplitted.slice(0, i).join('.');
                if (mapEvent.has(help)) {
                    for (let j = 0; j < mapEvent.get(help).length; j++) {
                        mapEvent.get(help)[j].func.call(mapEvent.get(help)[j].name);
                    }
                }
            }
            return this;
        },
        /**
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} times – сколько раз получить уведомление
         */
        several: function (event, context, handler, times) {
            this.on (event, context, function () {
                if (times > 0) {
                    times--;
                    handler.call(context);
                }
            })
            return this;
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         */
        through: function (event, context, handler, frequency) {
            let counter = 0;
            this.on (event, context, function () {
                if (counter % frequency === 0) {
                    handler.call(context);
                }
                counter++;
            })
            return this;
        }

    };
}

module.exports = {
    getEmitter
};