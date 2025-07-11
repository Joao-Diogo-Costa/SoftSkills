const Certificado = require("../model/Certificado");
const { Inscricao, Utilizador, Curso } = require("../model/Associations");
const ProgressoAulaAssincrona = require("../model/ProgressoAulaAssincrona");
const AulaAssincrona = require("../model/AulaAssincrona"); 
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

  console.log(JSON.stringify(inscricao, null, 2));


    if (!inscricao) {
      return res.status(404).json({ success: false, message: "Inscrição não encontrada." });
    }
    if (!inscricao.UTILIZADOR) {
      return res.status(400).json({ success: false, message: "Utilizador não encontrado na inscrição." });
    }
    if (!inscricao.CURSO) {
      return res.status(400).json({ success: false, message: "Curso não encontrado na inscrição." });
    }


  if (inscricao.CURSO.tipoCurso === "Presencial" && !inscricao.concluido) {
    return res
      .status(403)
      .json({ success: false, message: "O curso ainda não foi concluído para esta inscrição." });
  }

  if (inscricao.CURSO.tipoCurso === "Online") {
    const totalAulas = await AulaAssincrona.count({ where: { cursoId: inscricao.CURSO.id } });
    
    const aulasConcluidas = await ProgressoAulaAssincrona.count({
      where: { cursoId: inscricao.CURSO.id, utilizadorId: inscricao.UTILIZADOR.id }
    });

    if (totalAulas === 0) {
      return res.status(400).json({ success: false, message: "O curso não tem aulas registadas." });
    }

    if (aulasConcluidas < totalAulas) {
      return res.status(403).json({ success: false, message: "Ainda não concluiu todas as aulas do curso." });
    }
  }

  // Dados do certificado
  const formandoNome = inscricao.UTILIZADOR.nomeUtilizador;
  const cursoNome = inscricao.CURSO.nome;

  // Formatar a data 
  let dataConclusaoFormatada = '';
  const options = { day: 'numeric', month: 'long', year: 'numeric' };

  if (inscricao.CURSO.tipoCurso === "Presencial") {
    dataConclusaoFormatada = inscricao.dataConclusao
      ? new Intl.DateTimeFormat('pt-PT', options).format(inscricao.dataConclusao)
      : 'Data não disponível';
  } else if (inscricao.CURSO.tipoCurso === "Online") {
    const ultimaAula = await ProgressoAulaAssincrona.findOne({
      where: {
        cursoId: inscricao.CURSO.id,
        utilizadorId: inscricao.UTILIZADOR.id
      },
      order: [['dataConclusao', 'DESC']]
    });

    if (ultimaAula && ultimaAula.dataConclusao) {
      dataConclusaoFormatada = new Intl.DateTimeFormat('pt-PT', options).format(ultimaAula.dataConclusao);
    } else {
      dataConclusaoFormatada = 'Data não disponível';
    }
  }

  // Criar PDF
  const doc = new PDFDocument({
    size: "A4", 
    layout: "portrait",
    margins: { top: 50, bottom: 50, left: 72, right: 72 }, 
  });

  // Configurar download do PDF
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition",`attachment; filename="certificado-${formandoNome.replace(/\s/g, "_")}.pdf"`
  );


  doc.pipe(res);

  // --- Conteúdo do Certificado ---

  // Font
  doc.registerFont("Madina",path.join(__dirname, "../assets/fonts/Madina.ttf"));
  doc.registerFont("Fraunces-Regular",path.join(__dirname, "../assets/fonts/Fraunces-Regular.ttf"));
  // Imagem de fundo
  doc.image(path.join(__dirname, "../assets/certificado/fundo_template_softinsa.png"), 0, 0, { width: doc.page.width, height: doc.page.height });

  doc.moveDown(9);

  const imageWidth = 50;
  const imageHeight = 60;


  const xCenter = (doc.page.width - imageWidth) / 2;

  doc.image( path.join(__dirname, "../assets/certificado/badge_shaded_blue.png"), xCenter, 100,{ width: imageWidth, height: imageHeight, });

  doc
    .fontSize(48)
    .font("Fraunces-Regular")
    .text("CERTIFICADO", { align: "center", continued: false })
    .moveDown(0.5);


  doc
    .fontSize(28)
    .font("Helvetica")
    .text("Certificamos que", { align: "center", continued: false })
    .moveDown(0.5);


  doc
    .fontSize(60)
    .font("Madina")
    .text(formandoNome, { align: "center", continued: false });


  doc
    .fontSize(20)
    .font("Helvetica")
    .text("concluiu com sucesso o curso:", {
      align: "center",
      continued: false,
    });


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


  doc
    .fontSize(16)
    .font("Helvetica")
    .text(`${dataConclusaoFormatada}`, { align: "center", continued: false })
    .moveDown(0.5);

  // Assinatura
  const signatureLineY = doc.page.height - 175; 
  const commonMargin = 100; 

  // Empresa esquerda
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

  // Formador direita
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

  doc.end();
};

module.exports = controllers;
