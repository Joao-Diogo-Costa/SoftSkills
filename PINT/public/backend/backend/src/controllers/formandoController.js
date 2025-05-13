const Formando = require("../model/Formando");
const Gestor = require("../model/Gestor");

const bcrypt = require("bcryptjs");

const controllers = {};

// Listar formando
controllers.formando_list = async (req, res) => {
  try {
    const formandos = await Formando.findAll({
      include: [Gestor],
      order: [["nomeFormando", "ASC"]],
    });

    res.json({ success: true, data: formandos });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao listar formandos.", error });
  }
};

// Detail formando
controllers.formando_detail = async (req, res) => {
  try {
    const id = req.params.id;
    const formando = await Formando.findByPk(id, { include: [Gestor] });

    if (!formando) {
      return res.status(404).json({ success: false, message: "Formando não encontrado." });
    }

    res.json({ success: true, data: formando });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao buscar formando.", error });
  }
};

// Criar formando
controllers.formando_create = async (req, res) => {
  try {
    const { nomeFormando, dataNasc, nTel, email, password, outrasInf, pontos, gestorId } = req.body;

    if (!nomeFormando || !nTel || !email || !gestorId) {
      return res.status(400).json({ erro: "Campos obrigatórios em falta." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const novoFormando = await Formando.create({
      nomeFormando,
      dataNasc,
      nTel,
      email,
      password: hashedPassword,
      outrasInf,
      pontos,
      gestorId,
    });

    res.status(201).json({ success: true, data: novoFormando });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao criar formando.", details: error.message });
  }
};

// Atualizar formando
controllers.formando_update = async (req, res) => {
  try {
    const id = req.params.id;
    const { nomeFormando, dataNasc, nTel, email, password, outrasInf, pontos, gestorId } = req.body;

    const formando = await Formando.findByPk(id);
    if (!formando) {
      return res.status(404).json({ erro: "Formando não encontrado." });
    }

    await formando.update({
      nomeFormando,
      dataNasc,
      nTel,
      email,
      outrasInf,
      pontos,
      gestorId,
    });

     if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      dadosAtualizados.password = hashedPassword;
    }


    res.json({ success: true, data: formando });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao atualizar formando.", details: error.message });
  }
};

// Delete formando
controllers.formando_delete = async (req, res) => {
  try {
    const id = req.params.id;
    const formando = await Formando.findByPk(id);

    if (!formando) {
      return res.status(404).json({ erro: "Formando não encontrado." });
    }

    await formando.destroy();

    res.json({ success: true, message: "Formando apagado com sucesso." });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao apagar formando.", details: error.message });
  }
};

module.exports = controllers;