import { query } from "express";

const Pool = require('pg-pool');

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});


export async function executeQuery (client, queryStr: string, valuesArr: Array<any>) {
    console.log('queryStr:', queryStr);
    console.log('valuesArr:', valuesArr);
    return await client
    .query(queryStr, valuesArr)
    .then((response) => {
        console.log('response.rows', response.rows);
        console.log('response.rows[0]', response.rows[0]);
        return response.rows[0];
    });
}


export const normalizeEmptyStr = (x) => {
    return x ? x : '';
};