const ExtensionUtils = imports.misc.extensionUtils;
const extension = ExtensionUtils.getCurrentExtension();
const convenience = extension.imports.convenience;

const JDate = extension.imports.JDate;
const JalaliDate = extension.imports.JalaliDate;

const persian = extension.imports.events.persian;
const world = extension.imports.events.world;
const iranSolar = extension.imports.events.iranSolar;
const iranLunar = extension.imports.events.iranLunar;
const persianPersonage = extension.imports.events.persianPersonage;

const Schema = convenience.getSettings('org.gnome.shell.extensions.persian-calendar');

function Events() {
    this._init();
}

Events.prototype = {

    _init: function () {
        this._eventsList = [];
        if (Schema.get_boolean('event-persian')) {
            this._eventsList.push(new persian.persian(JDate.JDate));
        }
        if (Schema.get_boolean('event-world')) {
            this._eventsList.push(new world.world());
        }
        if (Schema.get_boolean('event-iran-solar')) {
            this._eventsList.push(new iranSolar.iranSolar());
        }
        if (Schema.get_boolean('event-iran-lunar')) {
            this._eventsList.push(new iranLunar.iranLunar());
        }
        if (Schema.get_boolean('event-persian-personage')) {
            this._eventsList.push(new persianPersonage.persianPersonage());
        }
    },

    getEvents: function (today) {
        this._events = '';
        this._isHoliday = false;
        this._today = [];

        // if it is friday
        if (today.getDay() === 5) {
            this._isHoliday = true;
        }

        // store gregorian date of today
        this._today[0] = [today.getFullYear(), today.getMonth() + 1, today.getDate()];

        // convert to Persian
        today = JDate.JDate.gregorianToJalali(today.getFullYear(), today.getMonth() + 1, today.getDate());
        // store persian date of today
        this._today[1] = [today.year, today.month, today.day];
        // store jalali date of today
        today = JalaliDate.JalaliDate.toJalali(this._today[0][0], this._today[0][1], this._today[0][2]);
        this._today[2] = [today.year, today.month, today.day];

        this._eventsList.forEach(this._checkEvent, this);
        return [this._events, this._isHoliday];
    },

    _checkEvent: function (el) {
        let type = 0;

        switch (el.type) {
        case 'gregorian':
            type = 0;
            break;
        case 'persian':
            type = 1;
            break;
        case 'jalali':
            type = 2;
            break;
        default:
            // do nothing
        }

        // if event is available, set event
        // and if it is holiday, set today as holiday!
        if (el.events[this._today[type][1]][this._today[type][2]]) {
            this._events += '\n' + el.events[this._today[type][1]][this._today[type][2]][0];
            this._isHoliday = this._isHoliday || el.events[this._today[type][1]][this._today[type][2]][1];
        }
    }
};
