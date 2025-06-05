const Certificado = require("../model/Certificado");
const Inscricao = require("../model/Inscricao");
const Utilizador = require('../model/Utilizador'); 
const Curso = require('../model/Curso'); 
const PDFDocument = require('pdfkit');
const path = require('path');

const controllers = {};

// Listar todos os certificados
controllers.certificado_list = async (req, res) => {
  try {
    const certificados = await Certificado.findAll({
      include: [Inscricao],
      order: [["id", "ASC"]],
    });

    res.json({ success: true, data: certificados });
  } catch (error) {
    res.status(500).json({success: false,message: "Erro ao listar certificados.",details: error.message,});
  }
};

// Detail certificado
controllers.certificado_detail = async (req, res) => {
  try {
    const id = req.params.id;
    const certificado = await Certificado.findByPk(id, {
      include: [Inscricao],
    });

    if (!certificado) {
      return res.status(404).json({ success: false, message: "Certificado não encontrado." });
    }

    res.json({ success: true, data: certificado });
  } catch (error) {
    res.status(500).json({success: false, message: "Erro ao buscar certificado.", details: error.message,});
  }
};

// Criar certificado
controllers.certificado_create = async (req, res) => {
  try {
    const { inscricaoId, dataCriacao } = req.body;

    if (!inscricaoId) {
      return res.status(400).json({ success: false, message: "ID da inscrição é obrigatório." });
    }

    const inscricao = await Inscricao.findByPk(inscricaoId);
    if (!inscricao) {
      return res.status(400).json({ success: false, message: "Inscrição não encontrada." });
    }

    const novoCertificado = await Certificado.create({
      inscricaoId,
      dataCriacao: dataCriacao || new Date(),
    });

    res.status(201).json({ success: true, data: novoCertificado });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao criar certificado.", details: error.message,});
  }
};


// Atualizar certificado
controllers.certificado_update = async (req, res) => {
  try {
    const id = req.params.id;
    const { inscricaoId, dataCriacao } = req.body;

    const certificado = await Certificado.findByPk(id);
    if (!certificado) {
      return res.status(404).json({ success: false, message: "Certificado não encontrado." });
    }

    if (inscricaoId) {
      const inscricao = await Inscricao.findByPk(inscricaoId);
      if (!inscricao) {
        return res.status(400).json({ success: false, message: "Inscrição não encontrada." });
      }
    }

    await certificado.update({
      inscricaoId,
      dataCriacao,
    });

    res.json({ success: true, data: certificado });
  } catch (error) {
    res.status(500).json({success: false, message: "Erro ao atualizar certificado.", details: error.message,});
  }
};

// Apagar certificado
controllers.certificado_delete = async (req, res) => {
  try {
    const id = req.params.id;
    const certificado = await Certificado.findByPk(id);

    if (!certificado) {
      return res.status(404).json({ success: false, message: "Certificado não encontrado." });
    }

    await certificado.destroy();

    res.json({ success: true, message: "Certificado apagado com sucesso." });
  } catch (error) {
    res.status(500).json({success: false, message: "Erro ao apagar certificado.", details: error.message, });
  }
};


controllers.gerarCertificado = async (req, res) => {
  const inscricaoId = req.params.inscricaoId;

  if (!inscricaoId) {
    return res
      .status(400)
      .json({ success: false, message: "ID da inscrição é obrigatório." });
  }

  const inscricao = await Inscricao.findByPk(inscricaoId, {
    include: [
      { model: Utilizador }, 
      { model: Curso }, 
    ],
  });

  // 1. Verificar se a inscrição existe
  if (!inscricao) {
    return res
      .status(404)
      .json({ success: false, message: "Inscrição não encontrada." });
  }

  // 2. Verificar se o curso foi concluído
  if (!inscricao.concluido) {
    return res
      .status(403).json({ success: false,message: "O curso ainda não foi concluído para esta inscrição.",});
  }

  // Dados do certificado
  const formandoNome = inscricao.Utilizador.nomeUtilizador;
  const cursoNome = inscricao.Curso.nome;

  // Formatar a data de conclusão
  let dataConclusaoFormatada = '';
  if (inscricao.dataConclusao) {

    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    dataConclusaoFormatada = new Intl.DateTimeFormat('pt-PT', options).format(inscricao.dataConclusao);

  } else {
    dataConclusaoFormatada = 'Data não disponível';

  }

  // 1. Criar um novo documento PDF
  const doc = new PDFDocument({
    size: "A4", // Tamanho do papel
    layout: "portrait", // Orientação paisagem
    margins: { top: 50, bottom: 50, left: 72, right: 72 }, // Margens padrão
  });

  // 2. Configurar os cabeçalhos da resposta HTTP para download do PDF
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition",`attachment; filename="certificado-${formandoNome.replace(/\s/g, "_")}.pdf"`
  );

  // 3. Pipe o documento para a resposta HTTP
  doc.pipe(res);

  // --- Conteúdo do Certificado ---

  // Fonte
  doc.registerFont("Madina",path.join(__dirname, "../assets/fonts/Madina.ttf"));
  doc.registerFont("Fraunces-Regular",path.join(__dirname, "../assets/fonts/Fraunces-Regular.ttf"));
  // Imagem de fundo
  doc.image(path.join(__dirname, "../assets/certificado/fundo_template_softinsa.png"), 0, 0, { width: doc.page.width, height: doc.page.height });

  doc.moveDown(9);

  const imageWidth = 50;
  const imageHeight = 60;

  // Calcular X centralizado
  const xCenter = (doc.page.width - imageWidth) / 2;

  doc.image( path.join(__dirname, "../assets/certificado/badge_shaded_blue.png"), xCenter, 100,{ width: imageWidth, height: imageHeight, });

  doc
    .fontSize(48)
    .font("Fraunces-Regular")
    .text("CERTIFICADO", { align: "center", continued: false })
    .moveDown(0.5);

  // Título "Certificamos que"
  doc
    .fontSize(28)
    .font("Helvetica")
    .text("Certificamos que", { align: "center", continued: false })
    .moveDown(0.5);

  // Nome do Formando
  doc
    .fontSize(60)
    .font("Madina")
    .text(formandoNome, { align: "center", continued: false });

  // Texto "concluiu com sucesso o curso:"
  doc
    .fontSize(20)
    .font("Helvetica")
    .text("concluiu com sucesso o curso:", {
      align: "center",
      continued: false,
    });

  // Nome do Curso
  doc
    .fontSize(20)
    .font("Helvetica-Bold")
    .text(cursoNome, { align: "center", continued: false });

  doc
    .fontSize(20)
    .font("Helvetica")
    .text(
      "com técnicas teóricas e práticas, atingindo todos os objetivos do curso.",
      { align: "center", continued: false }
    )
    .moveDown(5);

  // Data de Conclusão
  doc
    .fontSize(16)
    .font("Helvetica")
    .text(`${dataConclusaoFormatada}`, { align: "center", continued: false })
    .moveDown(0.5);

  // Linhas de Assinatura
  const signatureLineY = doc.page.height - 175; // Posição Y para as linhas de assinatura
  const commonMargin = 100; // Margem desejada de cada lado

  // --- Empresa (assinatura da esquerda) ---
  doc.image(
    path.join(__dirname, "../assets/certificado/SOFTINSA.png"),
    commonMargin,
    signatureLineY,
    {
      width: 100,
      height: 16,
    }
  );

  doc
    .fontSize(10)
    .font("Helvetica")
    .text("Assinatura Empresa", commonMargin, signatureLineY + 20, {
      align: "left",
    });

  // --- Formador (assinatura da direita) ---
  const formadorTextWidth = doc.widthOfString("Assinatura Formador");
  const formadorX = doc.page.width - commonMargin - formadorTextWidth;

  doc.image(
    path.join(__dirname, "../assets/certificado/assinatura.png"),
    doc.page.width - commonMargin - formadorTextWidth,
    signatureLineY - 20,
    {
      width: 100,
      height: 50,
    }
  );

  doc.fontSize(10).font("Helvetica");

  doc.text("Assinatura Formador", formadorX, signatureLineY + 20, {
    align: "left",
  });

  // 4. Finalizar o documento
  doc.end();
};

module.exports = controllers;
