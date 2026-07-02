import PDFDocument from 'pdfkit';
import bwipjs from 'bwip-js';

export async function gerarEtiqueta(assistencia, res) {

    const doc = new PDFDocument({
        size: [283.46, 141.73], //10x5cm
        margin: 8
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
        'Content-Disposition',
        `inline; filename=assistencia-${assistencia.codigo_interno}.pdf`
    );

    doc.pipe(res);

    const data = assistencia.data_solicitada
        ? new Date(assistencia.data_solicitada).toLocaleDateString('pt-BR')
        : '-';

    const pecasTexto =
        assistencia.numero_peca && assistencia.descricao_peca
            ? `${assistencia.numero_peca} - ${assistencia.descricao_peca}`
            : assistencia.descricao_peca || '-';


    // COLUNA ESQUERDA
    let y = 10;

    function campo(titulo, valor) {

        doc.font('Helvetica-Bold')
            .fontSize(8)
            .text(`${titulo}:`, 10, y, {
                continued: true
            });

        doc.font('Helvetica')
            .fontSize(8)
            .text(` ${valor ?? '-'}`, {
                width: 135
            });

        y += 14;
    }

    campo('Produto', assistencia.produto_descricao);

    campo('Peça', pecasTexto);

    campo('Fornecedor', assistencia.marca);

    campo('Data', data);

    campo('Defeito', assistencia.defeito);

    campo('Loja', assistencia.loja_nome);

    campo('SKU', assistencia.sku);

    // CÓDIGO DE BARRAS
    if (assistencia.codigo_gtin_ean) {

        const barcode = await bwipjs.toBuffer({
            bcid: 'code128',
            text: assistencia.codigo_gtin_ean,
            scale: 2.5,
            height: 12,
            includetext: true,
            textxalign: 'center',
            textyoffset: -6,
            paddingwidth: 0,
            paddingheight: 0
        });

        doc.image(barcode, 150, 45, {
            width: 120,
            height: 55
        });

    }


    // CÓDIGO INTERNO
    doc.font('Helvetica-Bold')
        .fontSize(8)
        .text(
            `CÓDIGO ASSISTÊNCIA: ${assistencia.codigo_interno}`,
            10,
            122,
            {
                width: 263,
                align: 'center'
            }
        );

    doc.end();

}