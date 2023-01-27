"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.incCounter = exports.counter = exports.getDate = exports.getDateTime = void 0;
function getDateTime(t = Date.now()) {
    return new Intl.DateTimeFormat('es-MX', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(t);
}
exports.getDateTime = getDateTime;
function getDate() {
    const today = new Date();
    function getMonth(n) {
        switch (n) {
            case 0: return 'Enero';
            case 1: return 'Febrero';
            case 2: return 'Marzo';
            case 3: return 'Abril';
            case 4: return 'Mayo';
            case 5: return 'Junio';
            case 6: return 'Julio';
            case 7: return 'Agosto';
            case 8: return 'Septiembre';
            case 9: return 'Octubre';
            case 10: return 'Noviembre';
            case 11: return 'Diciembre';
        }
    }
    return {
        year: today.getFullYear(),
        month: getMonth(today.getMonth()),
        day: today.getDate()
    };
}
exports.getDate = getDate;
exports.counter = 0;
function incCounter() {
    ++exports.counter;
}
exports.incCounter = incCounter;
//# sourceMappingURL=util.js.map