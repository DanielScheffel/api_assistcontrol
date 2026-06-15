import { getTotalAssistencias, 
    getAssistenciasPorStatus,
    getAssistenciasPorLoja,
    getAssistenciasPorFornecedor,
    getTempoMedioResolucao,
    getValorTotalParado
} from "../models/metricasModel.js";

export async function getTotalAssistenciaController(req, res) {
    try {
        const total = await getTotalAssistencias();

        res.status(200).json(total);
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

export async function getAssistenciasPorStatusController(req, res) {
    try {

        const total = await getAssistenciasPorStatus();

        res.status(200).json(total);

    } catch(error) {

        res.status(500).json({
            error: error.message
        });

    }
}

export async function getAssistenciasPorLojaController(req, res) {
    try {

        const metricas = await getAssistenciasPorLoja();

        res.status(200).json(metricas);

    } catch(error) {

        res.status(500).json({
            error: error.message
        });

    }
}

export async function getAssistenciasPorFornecedorController(req, res) {
    try {

        const metricas = await getAssistenciasPorFornecedor();

        res.status(200).json(metricas);

    } catch(error) {

        res.status(500).json({
            error: error.message
        });

    }
}

export async function getTempoMedioResolucaoController(req, res) {
    try {

        const resultado = await getTempoMedioResolucao();

        res.status(200).json(resultado);

    } catch(error) {

        res.status(500).json({
            error: error.message
        });

    }
}

export async function getValorTotalParadoController(req, res) {
    try {

        const resultado = await getValorTotalParado();

        return res.status(200).json(resultado);

    } catch(error) {

        return res.status(500).json({
            error: error.message
        });

    }
}