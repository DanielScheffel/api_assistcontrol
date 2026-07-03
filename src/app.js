import dotenv from 'dotenv';
dotenv.config()

import express from 'express';
import './config/database.js';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import authRoute from './routes/authRoute.js';
import userRoute from './routes/userRoute.js';
import supplierRoute from './routes/supplierRoute.js';
import categoryRoute from './routes/categoryRoute.js';
import lojaRoute from './routes/lojaRoute.js';
import produtoRoute from './routes/produtoRoute.js';
import assistenciaRoute from './routes/assistenciaRoute.js';
import metricasRoute from './routes/metricasRoute.js';

import etiquetaRoute from './routes/etiquetaRoute.js';
import relatorioRoute from './routes/relatorioRoute.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://assist-control-seven.vercel.app/"
  ],
  credentials: true
}))


app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use(
  "/uploads",
  (req, res, next) => {
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    next();
  },
  express.static("uploads")
);

app.use('/', authRoute);
app.use('/usuario', userRoute);
app.use('/fornecedor', supplierRoute);
app.use('/categoria', categoryRoute);
app.use('/lojas', lojaRoute);
app.use('/produtos', produtoRoute);
app.use('/assistencia', assistenciaRoute);
app.use('/metricas', metricasRoute);

app.use('/', etiquetaRoute);
app.use('/relatorio', relatorioRoute);

if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.get("/", (req, res) => {
    res.send("Hello World!");
})

export default app;