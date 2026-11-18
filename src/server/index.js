// mengimpor dotenv dan menjalankan konfigurasinya
import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import routes from '../routes/index.js';
import ErrorHandler from '../middlewares/error-handler.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);
app.use(ErrorHandler);

export default app;
