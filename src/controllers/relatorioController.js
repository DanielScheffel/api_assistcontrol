import { getRelatorioAssistencias } from "../models/relatorioModel.js";
import PDFDocument from "pdfkit";

export async function baixarRelatorioAssistenciasPDF(req, res) {
  try {
    const assistencias = await getRelatorioAssistencias(req.query);

    const doc = new PDFDocument({ margin: 40 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=relatorio-assistencias.pdf"
    );

    doc.pipe(res);

    doc.fontSize(18).text("Relatório de Assistências", { align: "center" });
    doc.moveDown();

    assistencias.forEach((a) => {
      doc.fontSize(11).text(`Código: ${a.codigo_interno}`);
      doc.text(`Loja: ${a.loja_nome}`);
      doc.text(`Produto: ${a.produto_descricao}`);
      doc.text(`Fornecedor: ${a.fornecedor}`);
      doc.text(`Status: ${a.status}`);
      doc.text(`Defeito: ${a.defeito}`);
      doc.moveDown();
    });

    doc.end();
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
}

export async function getRelatorioAssistenciasController(req, res) {
  try {
    const relatorio = await getRelatorioAssistencias(req.query);

    return res.status(200).json({
      total: relatorio.length,
      assistencias: relatorio,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
}