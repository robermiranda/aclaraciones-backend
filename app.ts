import express from 'express'
import aclaraciones from './src/routes/aclaraciones'
import datosAclarar from './src/routes/datosAclarar'
import path from 'node:path/posix'


const app = express();
const port: number = 3500;

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static('public'));

// Admin paths
app.use(express.static(path.join(__dirname, 'buildAdmin')))
app.get('/admin/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'buildAdmin', 'index.html'));
})

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
  
app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
})
