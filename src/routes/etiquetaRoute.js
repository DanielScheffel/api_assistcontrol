import express from 'express';
import { gerarEtiquetaController } from '../controllers/etiquetaController.js';

const router = express.Router();

router.get('/etiqueta/:id',
    gerarEtiquetaController
)

export default router;