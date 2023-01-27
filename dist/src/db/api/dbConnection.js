"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeEmptyStr = exports.executeQuery = exports.pool = void 0;
const Pool = require('pg-pool');
exports.pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});
function executeQuery(client, queryStr, valuesArr) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('queryStr:', queryStr);
        console.log('valuesArr:', valuesArr);
        return yield client
            .query(queryStr, valuesArr)
            .then((response) => {
            console.log('response.rows', response.rows);
            console.log('response.rows[0]', response.rows[0]);
            return response.rows[0];
        });
    });
}
exports.executeQuery = executeQuery;
const normalizeEmptyStr = (x) => {
    return x ? x : '';
};
exports.normalizeEmptyStr = normalizeEmptyStr;
//# sourceMappingURL=dbConnection.js.map