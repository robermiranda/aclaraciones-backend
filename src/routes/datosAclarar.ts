import express, {Request, Response, Router} from 'express'

const db = require('../db/api_datos_aclarar')

const router: Router = express.Router()

router.get('/', (req: Request, res: Response) => {
    db.datosAclarar()
    .then(response => {
        res.json({
            status: 'ok',
            data: {
                nacimiento: response[0],
                matrimonio: response[1],
                defuncion: response[2],
            }
        })
    })
    .catch(error => {
        res.json({
            status: 'error',
            msg: error
        })
    })
})

export default router