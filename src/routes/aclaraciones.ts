import express, {Request, Response, Router} from 'express'
import { _getAclaracion, _insertAclaracion } from '../db/aclaraciones'

const router: Router = express.Router()

router.route('/')
.get((req: Request, res: Response) => {
    _getAclaracion(undefined)
    .then(response => res.json(response))
    .catch(error => res.json(error))
})
.post((req: Request, res: Response) => {
    const b = req.body
    _insertAclaracion(b.promovente, b.titular, b.datosRegistrales, b.datosAclarar)
    .then(response => res.json(response))
    .catch(error => res.json(error))
})

router.get('/:numeroFolio', (req: Request, res: Response) => {
    _getAclaracion(parseInt(req.params.numeroFolio))
    .then(response => res.json(response))
    .catch(error => res.json(error))
})

export default router