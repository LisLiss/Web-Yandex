'use strict';


function makeListForIterator(friends, filter, maxLevel) {
    friends.sort((x, y) => x.name.localeCompare(y.name));
    let bestFriends = friends.filter(x => x.best === true);
    let used = new Set();
    let ans = [];
    for (; maxLevel > 0; maxLevel--) {
        if (bestFriends.length === 0) break;
        let help = [];
        bestFriends.forEach(function (x) {
            if (!used.has(x.name)) {
                used.add(x.name);
                ans.push(x);
                x.friends.forEach(function (y) {
                    if (!used.has(y.name)) {
                        help.push(y);
                    }
                })
            }
        })
        bestFriends = friends.filter(z => help.includes(z.name));
    }
    return ans.filter(filter.filter);
}

/**
 * Итератор по друзьям
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 */
function Iterator(friends, filter) {
    if (this.maxLevel === undefined) {
        this.maxLevel = Infinity;
    }
    this.answerList = makeListForIterator(friends, filter, this.maxLevel);
}

Object.setPrototypeOf(LimitedIterator.prototype, Iterator.prototype);

/**
 * Итератор по друзям с ограничением по кругу
 * @extends Iterator
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 * @param {Number} maxLevel – максимальный круг друзей
 */
function LimitedIterator(friends, filter, maxLevel) {
    this.maxLevel = maxLevel;
    Iterator.call(this, friends, filter);
}

Iterator.prototype.done = function () {
    return this.answerList.length === 0;
}

Iterator.prototype.next = function () {
    return this.done() ? null : this.answerList.shift();
}

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    if (this.filter === undefined) {
        this.filter = () => true;
    }
}

Object.setPrototypeOf(MaleFilter.prototype, Filter.prototype);

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    this.filter = s => s.gender === "male";
    Filter.call(this);
}

Object.setPrototypeOf(FemaleFilter.prototype, Filter.prototype);

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    this.filter = s => s.gender === "female";
    Filter.call(this);
}

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;