import express, { application } from 'express'
import aclaraciones from './src/routes/aclaraciones'
import datosAclarar from './src/routes/datosAclarar'


const app = express();
const PORT = process.env.PORT || 5000

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static('public'));
const cors = require('cors');

app.use(cors({
    origin: [process.env.ORIGIN_ADMIN, process.env.ORIGIN_SOLICITUD],
}));

app.use('/aclaraciones', aclaraciones)
app.use('/datos-aclarar', datosAclarar)

// catch 404 and forward to error handler
app.all('*', (req, res) => {
    res.redirect(301, '/')
});

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('<!DOCTYPE html><h2>Error en el sistema!!</h2>')
})
  
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
})
