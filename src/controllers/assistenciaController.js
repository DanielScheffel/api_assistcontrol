import { assistenciaModel, 
    getAssistenciaList,
    criarHistoricoStatus,
    updateStatusAssistencia
 }  from "../models/assistenciaModel.js";
import { criarImagemAssistencia } from "../models/assistenciaImagemModel.js";

export async function getAssistenciaListController(req, res) {
    try {
        const assistenciaList = await getAssistenciaList();
        res.status(200).json(assistenciaList);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
}

export async function assistenciaController(req, res) {
    try {
        const { defeito, numero_peca, descricao_peca, loja_id, produto_id, status_assistencia_id } = req.body;
        const usuarioLogado = req.user;


        const result = await assistenciaModel(
            defeito,
            numero_peca,
            descricao_peca,
            loja_id,
            usuarioLogado.id_usuario,
            produto_id,
            status_assistencia_id
        );

        await criarHistoricoStatus(
            result.id,
            status_assistencia_id
        )

        if(req.files && req.files.length > 0) {
            for (const file of req.files) {
                await criarImagemAssistencia(
                    result.id,
                    file
                )
            }
        }

        // console.log("BODY: ", req.body);
        // console.log("FILES: ", req.files)

        res.status(201).json(result);

    } catch (error) {
        res.status(400).json({
            error: error.message,
        })
    }

}

export async function updateStatusAssistenciaController(req, res) {
    try {
        const { id } = req.params;
        const { status_assistencia_id } = req.body;

        const result = await updateStatusAssistencia(
            id,
            status_assistencia_id
        );

        await criarHistoricoStatus(
            id,
            status_assistencia_id
        )

        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({
            error: error.message,
        })
    }
}