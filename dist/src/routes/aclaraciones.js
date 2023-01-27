"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const aclaraciones_1 = require("../db/aclaraciones");
const router = express_1.default.Router();
router.route('/')
    .get((req, res) => {
    (0, aclaraciones_1._getAclaracion)(undefined)
        .then(response => res.json(response))
        .catch(error => res.json(error));
})
    .post((req, res) => {
    const b = req.body;
    (0, aclaraciones_1._insertAclaracion)(b.promovente, b.titular, b.datosRegistrales, b.datosAclarar)
        .then(response => res.json(response))
        .catch(error => res.json(error));
});
router.get('/:numeroFolio', (req, res) => {
    (0, aclaraciones_1._getAclaracion)(parseInt(req.params.numeroFolio))
        .then(response => res.json(response))
        .catch(error => res.json(error));
});
exports.default = router;
//# sourceMappingURL=aclaraciones.js.map