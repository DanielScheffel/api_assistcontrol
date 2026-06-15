import {
  assistenciaModel,
  getAssistenciaList,
  criarHistoricoStatus,
  updateStatusAssistencia,
  getAssistenciaById,
  getSearchAssistenciaModel,
} from "../models/assistenciaModel.js";
import { criarImagemAssistencia } from "../models/assistenciaImagemModel.js";
import { sendEmailAssistencia } from "../services/serviceEmailAssistencia.js";

// Controller para obter a lista de assistências
export async function getAssistenciaListController(req, res) {
  try {
    const assistenciaList = await getAssistenciaList();
    res.status(200).json(assistenciaList);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
}

// Controller para criar uma nova assistência
export async function assistenciaController(req, res) {
  try {
    const {
      defeito,
      numero_peca,
      descricao_peca,
      loja_id,
      produto_id,
      status_assistencia_id,
    } = req.body;
    const usuarioLogado = req.user;

    const result = await assistenciaModel(
      defeito,
      numero_peca,
      descricao_peca,
      loja_id,
      usuarioLogado.id_usuario,
      produto_id,
      status_assistencia_id,
    );

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        await criarImagemAssistencia(result.id, file);
      }
    }

    await criarHistoricoStatus(result.id, status_assistencia_id);

    try {
      await sendEmailAssistencia(result.id);
    } catch (emailError) {
      console.error("Erro ao enviar email de assistência:", emailError);
    }

    // console.log("BODY: ", req.body);
    // console.log("FILES: ", req.files)

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
}

// Controller para atualizar o status de uma assistência
export async function updateStatusAssistenciaController(req, res) {
  try {
    const { id } = req.params;
    const { status_assistencia_id } = req.body;

    const result = await updateStatusAssistencia(id, status_assistencia_id);

    await criarHistoricoStatus(id, status_assistencia_id);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
}

// Controller para obter uma assistência por ID
export async function getAssistenciaByIdController(req, res) {
  try {
    const { id } = req.params;
    const result = await getAssistenciaById(id);

    if (!result) {
      return res.status(404).json({
        error: "Assistência não encontrada",
      });
    }

    return res.status(200).json({
      assistencia: result,
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
}

// Controller para buscar assistências com base em filtros
export async function getSearchAssistenciaController(req, res) {
  try {
    const filtros = req.query;

    const assistencia = await getSearchAssistenciaModel(filtros);

    res.status(200).json(assistencia);
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
}
