import express, {Request, Response, Router} from 'express';
import datosAclarar from '../db/api/datosAclarar';

const router: Router = express.Router()

router.get('/', (req: Request, res: Response) => {
    datosAclarar()
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