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

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

app.use('/', authRoute);
app.use('/usuario', userRoute);
app.use('/fornecedor', supplierRoute);

if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.get("/", (req, res) => {
    res.send("Hello World!");
})

export default app;