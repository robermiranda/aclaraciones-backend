"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const datosAclarar_1 = __importDefault(require("../db/api/datosAclarar"));
const router = express_1.default.Router();
router.get('/', (req, res) => {
    (0, datosAclarar_1.default)()
        .then(response => {
        res.json({
            status: 'ok',
            data: {
                nacimiento: response[0],
                matrimonio: response[1],
                defuncion: response[2],
            }
        });
    })
        .catch(error => {
        res.json({
            status: 'error',
            msg: error
        });
    });
});
exports.default = router;
//# sourceMappingURL=datosAclarar.js.map