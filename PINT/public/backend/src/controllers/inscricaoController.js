const Curso = require("../model/Curso");
const Utilizador = require("../model/Utilizador");
const Inscricao = require("../model/Inscricao");
const { Sequelize } = require("sequelize");
const sequelize = require("../model/database");
const nodemailer = require("nodemailer");
require("dotenv").config();


const controllers = {};

// Listar inscricao
controllers.inscricao_list = async (req, res) => {
  try {
    const inscricoes = await Inscricao.findAll({
      include: [Curso, Utilizador],
      order: [["dataInscricao", "DESC"]],
    });
    res.json({ success: true, data: inscricoes });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao listar inscrições.", details: error.message });
  }
};

controllers.incricaolistByCurso = async (req, res) => {
  try {
    const { cursoId } = req.params;
    const inscricoes = await Inscricao.findAll({
      where: { cursoId },
      include: [{ model: Utilizador }]
    });
    res.json({ success: true, data: inscricoes });
  } catch (error) {
    res.status(500).json({ message: "Erro ao listar inscrições.", details: error.message });
  }
};

// Detail inscricao
controllers.inscricao_detail = async (req, res) => {
  try {
    const id = req.params.id;
    const inscricao = await Inscricao.findByPk(id, {
      include: [Curso, Utilizador],
    });

    if (!inscricao) {
      return res.status(404).json({ success: false, message: "Inscrição não encontrada." });
    }

    res.json({ success: true, data: inscricao });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao obter inscrição.", details: error.message });
  }
};

// Criar inscricao
controllers.inscricao_create = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { utilizadorId, cursoId } = req.body;

    const curso = await Curso.findByPk(cursoId, { transaction: t });
    if (!curso) {
      await t.rollback();
      return res.status(404).json({ success: false, message: "Curso não encontrado." });
    }

    const hoje = new Date();
    if (curso.dataLimiteInscricao && curso.dataLimiteInscricao < hoje) {
      await t.rollback();
      return res.status(400).json({ success: false, message: "Prazo de inscrição expirado." });
    }

    // O curso só pode aceitar inscrições se o estado for 'Pendente' (0)
    if (curso.estado !== 0) {
        await t.rollback();
        let mensagemErro = "O curso não está disponível para novas inscrições.";
        if (curso.estado === 1) {
            mensagemErro = "O curso já está em andamento e não aceita novas inscrições.";
        } else if (curso.estado === 2) {
            mensagemErro = "O curso já terminou e não aceita novas inscrições.";
        }
        return res.status(400).json({ success: false, message: mensagemErro });
    }


    if (curso.vaga !== null && curso.vaga <= 0) {
      await t.rollback();
      return res.status(400).json({ success: false, message: "Não há vagas disponíveis." });
    }
    
    const jaInscrito = await Inscricao.findOne({
      where: { cursoId, utilizadorId },
      transaction: t,
    });

    if (jaInscrito) {
      await t.rollback();
      return res.status(400).json({ success: false, message: "Utilizador já está inscrito neste curso." });
    }

    const novaInscricao = await Inscricao.create({
      cursoId,
      utilizadorId,
    }, { transaction: t });

    await curso.increment('numParticipante', { by: 1, transaction: t });

    if (curso.tipoCurso === 'Presencial' && curso.vaga !== null) {
      await curso.decrement('vaga', { by: 1, transaction: t });
    }

    await t.commit(); 
    res.status(201).json({ success: true, data: novaInscricao });

    try {
      const utilizador = await Utilizador.findByPk(utilizadorId);
      if (utilizador && curso) {
        const transporter = nodemailer.createTransport({
          host: process.env.EMAIL_HOST,
          port: process.env.EMAIL_PORT,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
          },
        });

        const mailOptions = {
          from: process.env.EMAIL_FROM,
          to: utilizador.email,
          subject: `Confirmação de inscrição no curso "${curso.nome}" - SoftSkills`,
          html: `
            <div style="font-family: Arial, Helvetica, sans-serif; background: #f6f8fa; padding: 32px;">
              <div style="max-width: 520px; margin: auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px #e0e7ef; padding: 32px;">
                <div style="text-align: center; margin-bottom: 24px;">
                  <img src="https://pint-2025.s3.eu-north-1.amazonaws.com/softskills_logo.png" alt="SoftSkills" style="height: 60px; margin-bottom: 8px;" />
                </div>
                <h3 style="color: #39639D;">Inscrição confirmada!</h3>
                <p style="color: #333;">Olá <strong>${utilizador.nomeUtilizador}</strong>,</p>
                <p style="color: #333;">A sua inscrição no curso <strong>${curso.nome}</strong> foi efetuada com sucesso na plataforma <strong>SoftSkills</strong>.</p>
                <table style="width: 100%; margin: 16px 0 24px 0; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #294873;"><strong>Curso:</strong></td>
                    <td style="padding: 8px 0;">${curso.nome}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #294873;"><strong>Data de início:</strong></td>
                    <td style="padding: 8px 0;">${curso.dataInicio ? new Date(curso.dataInicio).toLocaleDateString() : 'A definir'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #294873;"><strong>Modalidade:</strong></td>
                    <td style="padding: 8px 0;">${curso.tipoCurso}</td>
                  </tr>
                </table>
                <p style="color: #333;">Receberá mais informações sobre o curso em breve.</p>
                <p style="color: #333;">Se tiver alguma dúvida, contacte o suporte através do email <a href="mailto:support@softskills.com" style="color: #39639D;">support@softskills.com</a>.</p>
                <hr style="margin: 32px 0; border: none; border-top: 1px solid #e0e7ef;" />
                <p style="font-size: 13px; color: #888; text-align: center;">
                  &copy; ${new Date().getFullYear()} SoftSkills. Todos os direitos reservados.
                </p>
              </div>
            </div>
          `,
        };

        await transporter.sendMail(mailOptions);
      }
    } catch (err) {
      console.error("Erro ao enviar email de confirmação de inscrição:", err);
    }

  } catch (error) {
    await t.rollback(); 
    res.status(500).json({ success: false, message: "Erro ao criar inscrição.", details: error.message });
  }
};

// Atualizar inscricao
controllers.inscricao_update = async (req, res) => {

  const t = await sequelize.transaction();

  try {
    const id = req.params.id;

    const { notaFinal, concluido, dataConclusao, certificadoGerado } = req.body;

    const inscricao = await Inscricao.findByPk(id, { transaction: t });

    if (!inscricao) {
      await t.rollback(); 
      return res.status(404).json({ success: false, message: "Inscrição não encontrada." });
    }

    const dadosParaAtualizar = {};
    if (notaFinal !== undefined) dadosParaAtualizar.notaFinal = notaFinal;
    if (concluido !== undefined) dadosParaAtualizar.concluido = concluido;
    if (dataConclusao !== undefined) dadosParaAtualizar.dataConclusao = dataConclusao;
    if (certificadoGerado !== undefined) dadosParaAtualizar.certificadoGerado = certificadoGerado;

    if (Object.keys(dadosParaAtualizar).length === 0) {
      await t.rollback();
      return res.status(400).json({ success: false, message: "Nenhum campo válido fornecido para atualização." });
    }

    await inscricao.update(dadosParaAtualizar, { transaction: t });

    await t.commit(); 
    res.json({ success: true, message: "Inscrição atualizada com sucesso.", data: inscricao });
  } catch (error) {
    await t.rollback(); 
    res.status(500).json({ success: false, message: "Erro ao atualizar inscrição.", details: error.message });
  }
};


// Apagar inscricao
controllers.inscricao_delete = async (req, res) => {

  const t = await sequelize.transaction();

  try {
    const id = req.params.id;
    const inscricao = await Inscricao.findByPk(id, { transaction: t });

    if (!inscricao) {
      return res.status(404).json({ success: false, message: "Inscrição não encontrada." });
    }

    const curso = await Curso.findByPk(inscricao.cursoId, { transaction: t });

    if (curso && curso.numParticipante > 0) {
        await curso.decrement('numParticipante', { by: 1, transaction: t });
    }

    if (curso && curso.tipoCurso === 'Presencial' && curso.vaga !== null) {
        await curso.increment('vaga', { by: 1, transaction: t });
    }

    await inscricao.destroy({ transaction: t });

    await t.commit();
    res.json({ success: true, message: "Inscrição removida com sucesso." });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ success: false, message: "Erro ao remover inscrição.", details: error.message });
  }
};

// lista de inscricao por utilizador
controllers.inscricao_list_user = async (req, res) => {
  try {
    const utilizadorId = req.params.utilizadorId;
    const inscricoes = await Inscricao.findAll({
      where: { utilizadorId },
      include: [Curso],
      order: [["dataInscricao", "DESC"]],
    });
    res.json({ success: true, data: inscricoes });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao buscar inscrições do utilizador.", details: error.message });
  }
};

module.exports = controllers;