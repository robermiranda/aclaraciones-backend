"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const aclaraciones_1 = __importDefault(require("./src/routes/aclaraciones"));
const datosAclarar_1 = __importDefault(require("./src/routes/datosAclarar"));
const posix_1 = __importDefault(require("node:path/posix"));

const app = (0, express_1.default)();
const port = 3500;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.static('public'));
// Admin paths
app.use(express_1.default.static(posix_1.default.join(__dirname, 'buildAdmin')));
app.get('/admin/*', function (req, res) {
    res.sendFile(posix_1.default.join(__dirname, 'buildAdmin', 'index.html'));
});
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
app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
});
//# sourceMappingURL=app.js.map