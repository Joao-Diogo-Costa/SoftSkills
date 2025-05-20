const Utilizador = require("../model/Utilizador");

const bcrypt = require("bcryptjs");

const controllers = {};

// Listar todos os utilizadores
controllers.utilizador_list = async (req, res) => {
    try {
        const utilizadores = await Utilizador.findAll({
            order: [['id', 'ASC']]
        });
        res.json({ success: true, data: utilizadores });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erro ao listar utilizadores.", error: error.message });
    }
};

// Obter detalhes de um utilizador
controllers.utilizador_detail = async (req, res) => {
    try {
        const id = req.params.id;

        const utilizador = await Utilizador.findByPk(id);

        if (utilizador) {
            res.json({ success: true, data: utilizador });
        } else {
            res.status(404).json({ success: false, message: "Utilizador não encontrado." });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Erro ao obter utilizador.", error: error.message });
    }
};

// Criar novo utilizador
controllers.utilizador_create = async (req, res) => {
    try {
        const { nomeUtilizador,dataNasc,nTel,email,password, imagemPerfil, role, } = req.body;

        if (!nomeUtilizador || !dataNasc || !nTel || !email || !password || !role) {
            return res.status(400).json({ erro: "Todos os campos são obrigatórios." });
        }

        const utilizadorExistente = await Utilizador.findOne({ where: { email } });

        if (utilizadorExistente) {
            return res.status(409).json({ message: "Já existe um utilizador com este email." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const novoUtilizador = await Utilizador.create({
            nomeUtilizador,
            dataNasc,
            nTel,
            email,
            password: hashedPassword,
            imagemPerfil: imagemPerfil ?? null,
            role: role ?? "formando",

        });

        res.status(201).json({ success: true, data: novoUtilizador });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erro ao criar utilizador.", error: error.message });
    }
};

// Atualizar utilizador
controllers.utilizador_update = async (req, res) => {
    try {
        const id = req.params.id;
        const { nomeUtilizador, dataNasc, nTel, email, password } = req.body;

        const utilizador = await Utilizador.findByPk(id);

        if (!utilizador) {
            return res.status(404).json({ erro: "Utilizador não encontrado." });
        }

        const dadosAtualizados = {
        nomeUtilizador,
        dataNasc,
        nTel,
        email,
        imagemPerfil,
        role,
        pontos,
        };

        if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        dadosAtualizados.password = hashedPassword;
        }

        await utilizador.update(dadosAtualizados);

        res.json({ success: true, data: utilizador });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erro ao atualizar utilizador.", error: error.message });
    }
};

// Eliminar utilizador
controllers.utilizador_delete = async (req, res) => {
    try {
        const id = req.params.id;

        const utilizador = await Utilizador.findByPk(id);

        if (!utilizador) {
            return res.status(404).json({ erro: "Utilizador não encontrado." });
        }

        await utilizador.destroy();

        res.json({ success: true, message: "Utilizador eliminado com sucesso." });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erro ao eliminar utilizador.", error: error.message });
    }
};

module.exports = controllers;