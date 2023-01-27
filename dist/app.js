"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const aclaraciones_1 = __importDefault(require("./src/routes/aclaraciones"));
const datosAclarar_1 = __importDefault(require("./src/routes/datosAclarar"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.static('public'));
const cors = require('cors');
app.use(cors({
    //origin: 'http://localhost:3000',
    origin: [process.env.ORIGIN_ADMIN, process.env.ORIGIN_SOLICITUD],
}));
app.use('/aclaraciones', aclaraciones_1.default);
app.use('/datos-aclarar', datosAclarar_1.default);
// catch 404 and forward to error handler
app.all('*', (req, res) => {
    res.redirect(301, '/');
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('<!DOCTYPE html><h2>Error en el sistema!!</h2>');
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
//# sourceMappingURL=app.js.map