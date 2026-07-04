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

    const logoPath = path.join(__dirname, "../assets/logo-white.png");

    // Cabeçalho azul
    doc.rect(0, 0, doc.page.width, 105).fill("#2563eb");

    doc.image(logoPath, 40, 25, { width: 145 });

    doc
      .fillColor("#ffffff")
      .fontSize(20)
      .text("Relatório de Assistências", 220, 30);

    doc
      .fontSize(10)
      .text(`Data de emissão: ${new Date().toLocaleString("pt-BR")}`, 220, 60)
      .text(`Gerado por: ${req.user.nome}`, 220, 90)
      .text(`Total de assistências: ${assistencias.length}`, 220, 75);


    doc.y = 130;

    const resumoX = 40;
    const resumoY = doc.y;
    const resumoWidth = 515;
    const resumoHeight = 70;

    doc
      .roundedRect(resumoX, resumoY, resumoWidth, resumoHeight, 6)
      .fillAndStroke("#f8fafc", "#d1d5db");

    doc
      .fillColor("#2563eb")
      .font("Helvetica-Bold")
      .fontSize(12)
      .text("RESUMO DO RELATÓRIO", resumoX + 15, resumoY + 12);

    doc
      .fillColor("#111827")
      .font("Helvetica")
      .fontSize(10)
      .text(`Data de emissão: ${new Date().toLocaleString("pt-BR")}`, resumoX + 15, resumoY + 32)
      .text(`Gerado por: ${req.user.nome}`, resumoX + 250, resumoY + 32)
      .text(`Total de registros: ${assistencias.length}`, resumoX + 15, resumoY + 50);

    doc.y = resumoY + resumoHeight + 20;

    // Cards
    assistencias.forEach((a) => {
      if (doc.y > 680) {
        doc.addPage();
        doc.y = 50;
      }

      const cardX = 40;
      const cardY = doc.y;
      const cardWidth = 515;
      const cardHeight = 118;
      const statusColor = {
        "Aberto": "#dc2626",
        "Em análise": "#f59e0b",
        "Aguardando peça": "#2563eb",
        "Finalizada": "#16a34a",
        "Cancelada": "#6b7280"
      };

      doc
        .roundedRect(cardX, cardY, cardWidth, cardHeight, 8)
        .strokeColor("#d1d5db")
        .lineWidth(1)
        .stroke();
        
      doc
        .roundedRect(cardX, cardY, cardWidth, 8, 8)
        .fill("#2563eb")

      
      doc
        .fillColor("#1d4ed8")
        .fontSize(14)
        .text(`Assistência ${a.codigo_interno}`, cardX + 15, cardY + 12);


      doc
        .fillColor("#111827")
        .fontSize(10)
        .text(`Loja: ${a.loja_nome}`, cardX + 15, cardY + 38)
        .text(`Produto: ${a.produto_descricao}`, cardX + 15, cardY + 53)
        .text(`Fornecedor: ${a.fornecedor}`, cardX + 15, cardY + 68)
        .text(`Defeito: ${a.defeito}`, cardX + 15, cardY + 98, {
          width: cardWidth - 30,
        });
        
        doc
          .fillColor(statusColor[a.status] || "#111827")
          .font("Helvetica-Bold")
          .text(a.status, 430, cardY + 15);

        doc.font("Helvetica");


      doc.y = cardY + cardHeight + 15;
    });

    // Rodapé
    doc
      .fontSize(9)
      .fillColor("#6b7280")
      .text(
        "AssistControl - Relatório gerado automaticamente",
        40,
        780,
        { align: "center" }    
      );

    doc
      .text(
        `Página ${doc.bufferedPageRange().start + 1}`,
        40,
        780,
        { align: "right"}
      )


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