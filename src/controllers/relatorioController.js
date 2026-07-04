import { getRelatorioAssistencias } from "../models/relatorioModel.js";
import PDFDocument from "pdfkit";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function baixarRelatorioAssistenciasPDF(req, res) {
  try {
    const assistencias = await getRelatorioAssistencias(req.query);

    const doc = new PDFDocument({ margin: 40, size: "A4", });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=relatorio-assistencias.pdf"
    );

    doc.pipe(res);

    const logoPath = path.join(__dirname, "../assets/logo.png");

    // cabeçalho do PDF
    doc.image(logoPath, 40, 30, { width: 150 });

    doc.fontSize(18).text("Relatório de Assistências", 40, 110);

    doc
      .fontSize(10)
      .fillColor("#555")
      .text(`Data: ${new Date().toLocaleDateString("pt-BR")}`, 40, 135)
      .text(`Total de Assistências: ${assistencias.length}`, 40, 150);

      doc
        .moveTo(40, 175)
        .lineTo(555, 175)
        .strokeColor("#cccccc")
        .stroke();

      doc.moveDown(2);
      doc.fillColor("#000")


      // Conteúdo do PDF
      assistencias.forEach((a, index) => {
      if (doc.y > 720) {
        doc.addPage();
      }

      doc
        .fillColor("#1f4ed8")
        .fontSize(14)
        .text(`Assistência ${a.codigo_interno}`);

      doc.fillColor("#000").fontSize(10);

      doc.text(`Loja: ${a.loja_nome}`);
      doc.text(`Produto: ${a.produto_descricao}`);
      doc.text(`Fornecedor: ${a.fornecedor}`);
      doc.text(`Status: ${a.status}`);
      doc.text(`Defeito: ${a.defeito}`);

      doc.moveDown();

      doc
        .moveTo(40, doc.y)
        .lineTo(555, doc.y)
        .strokeColor("#eeeeee")
        .stroke();

      doc.moveDown();
    });

    // Rodapé do PDF
    doc
      .fontSize(9)
      .fillColor("#777")
      .text("AssistControl - Relatório gerado automaticamente", 40, 780, {
        align: "center",
      })

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