import { getAssistenciaById } from '../models/assistenciaModel.js';
import { gerarEtiqueta } from '../services/etiquetaService.js';

export async function gerarEtiquetaController(req, res) {

    try {

        const { id } = req.params;

        const assistencia = await getAssistenciaById(id);

        if (!assistencia) {
            return res.status(404).json({
                erro: "Assistência não encontrada"
            });
        }

        await gerarEtiqueta(assistencia, res);

    } catch (error) {

        return res.status(500).json({
            erro: error.message
        });

    }

}