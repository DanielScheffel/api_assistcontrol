import { getAssistenciaById } from '../models/assistenciaModel.js';
import { sendEmail } from './emailService.js';

export async function sendEmailAssistencia(assistenciaID) {

    const assistencia = await getAssistenciaById(assistenciaID);

    const anexos = assistencia.imagens.map(imagem => ({
        filename: imagem.nome_arquivo,
        path: imagem.url_arquivo
    }));


    const numeros = assistencia.numero_peca
        .replace(/\se\s/g, ',')
        .split(',')
        .map(item => item.trim())
        
    const descricoes = assistencia.descricao_peca
        .replace(/\se\s/g, ',')
        .split(',')
        .map(item => item.trim())

    let pecasTexto = "Peças solicitadas:\n";

    for(let i = 0; i < numeros.length; i++) {
        pecasTexto += `- ${numeros[i]}`;

        if(descricoes[i]) {
            pecasTexto += ` (${descricoes[i]})`;
        }

        pecasTexto += '\n';
    }
    
    const texto = `
    Boa tarde!
    
    Loja: ${assistencia.loja_nome}

    Fornecedor: ${assistencia.marca}

    Produto: ${assistencia.produto_descricao}
    
    ${pecasTexto}

    Causa do problema: ${assistencia.defeito}

    =======================================
    COLOCAR ESTE CÓDIGO NA ASSISTÊNCIA: ${assistencia.codigo_interno}
    =======================================

    Agradecemos a atenção e aguardamos um retorno breve.

    Atenciosamente,
    Equipe AssistControl
    `;

    await sendEmail({
        to: assistencia.fornecedor_email,
        subject: `Solicitação de Assistência Pratik`,
        text: texto,
        anexos
    });

}