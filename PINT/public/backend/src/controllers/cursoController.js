const Curso = require("../model/Curso");
const Formador = require("../model/Formador");
const CategoriaC = require("../model/CategoriaC");
const AreaC = require("../model/AreaC");
const TopicoC = require("../model/TopicoC");
const sequelize = require("../model/database");


const controllers = {};

// Listar cursos
controllers.curso_list = async (req, res) => {
  try {
    const cursos = await Curso.findAll({
      include: [Formador, CategoriaC, AreaC, TopicoC],
      order: [['categoriaId', 'ASC']],
    });

    res.json({ success: true, data: cursos });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao listar cursos.", details: error.message  });
  }
};

// Detail curso
controllers.curso_detail = async (req, res) => {
  try {
    const id = req.params.id;

    const curso = await Curso.findByPk(id, {
      include: [Formador, CategoriaC, AreaC, TopicoC],
    });

    if (curso) {
      res.json({ success: true, data: curso });
    } else {
      res.status(404).json({ success: false, message: "Curso não encontrado." });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao encontrar curso.", details: error.message });
  }
};

// Criar curso
controllers.curso_create = async (req, res) => {
  console.log("Corpo da requisição (req.body):", req.body);
  try {
    const { nome, descricaoCurso, duracao, pontuacao, formadorId, categoriaId, areaId, topicoId, tipoCurso, nivel,  } = req.body;

    if (!nome || !descricaoCurso || !duracao || !pontuacao || !formadorId || !categoriaId || !areaId || !topicoId || !tipoCurso || !nivel) {
      return res.status(400).json({ erro: "Campos obrigatórios faltando." });
    }

    // Verificar se os IDs existem
    const formadorExiste = await Formador.findByPk(formadorId);
    const categoriaExiste = await CategoriaC.findByPk(categoriaId);
    const areaExiste = await AreaC.findByPk(areaId);
    const topicoExiste = await TopicoC.findByPk(topicoId);

    if (!formadorExiste) {
      return res.status(400).json({ erro: "ID de Formador inválido." });
    }
    if (!categoriaExiste) {
      return res.status(400).json({ erro: "ID de Categoria inválido." });
    }
    if (!areaExiste) {
      return res.status(400).json({ erro: "ID de Área inválido." });
    }
    if (!topicoExiste) {
      return res.status(400).json({ erro: "ID de Tópico inválido." });
    }
        
    // Validar o tipoCurso
    if (tipoCurso !== "Online" && tipoCurso !== "Presencial") {
      return res.status(400).json({ erro: "O campo tipoCurso deve ser 'Online' ou 'Presencial'." });
    }

    // Validar o nivel
    if (nivel !== "Básico" && nivel !== "Intermediário" && nivel !== "Avançado") {
      return res.status(400).json({ erro: "O campo nivel deve ser 'Básico', 'Intermediário' ou 'Avançado'." });
    }

    const novoCurso = await Curso.create({
      nome,
      descricaoCurso,
      duracao,
      pontuacao,
      formadorId,
      categoriaId,
      areaId,
      topicoId,
      tipoCurso,
      nivel,
      estado: 0,
      dataUpload: new Date(),
    });

    res.status(201).json({ success: true, data: novoCurso });
  } catch (error) {
    console.log("Erro ao criar curso:", error);
    res.status(500).json({ message: "Erro ao criar curso.", details: error.message });
  }
};

// Atualizar curso
controllers.curso_update = async (req, res) => {
  try {
    const { nome, descricaoCurso,duracao, pontuacao, formadorId, categoriaId, areaId, topicoId, tipoCurso, estado, nivel, imagemBanner } = req.body;

    const curso = await Curso.findByPk(req.params.id);

    if (!curso) {
      return res.status(404).json({ message: "Curso não encontrado." });
    }

    // Verificar se os IDs existem 
    if (formadorId) {
      const formadorExiste = await Formador.findByPk(formadorId);
      if (!formadorExiste) {
        return res.status(400).json({ message: "ID de Formador inválido." });
      }
    }
    if (categoriaId) {
      const categoriaExiste = await CategoriaC.findByPk(categoriaId);
      if (!categoriaExiste) {
        return res.status(400).json({ message: "ID de Categoria inválido." });
      }
    }
    if (areaId) {
      const areaExiste = await AreaC.findByPk(areaId);
      if (!areaExiste) {
        return res.status(400).json({ message: "ID de Área inválido." });
      }
    }
    if (topicoId) {
      const topicoExiste = await TopicoC.findByPk(topicoId);
      if (!topicoExiste) {
        return res.status(400).json({ message: "ID de Tópico inválido." });
      }
    }

    // Validar o tipoCurso se fornecido
    if (tipoCurso && tipoCurso !== "Online" && tipoCurso !== "Presencial") {
      return res.status(400).json({ message: "O campo tipoCurso deve ser 'Online' ou 'Presencial'." });
    }

    // Validar o nivel se fornecido
    if (nivel && nivel !== "Básico" && nivel !== "Intermediário" && nivel !== "Avançado") {
      return res.status(400).json({ message: "O campo nivel deve ser 'Básico', 'Intermediário' ou 'Avançado'." });
    }

    if (curso) {
      await curso.update({
        nome,
        descricaoCurso,
        duracao,
        pontuacao,
        formadorId,
        categoriaId,
        areaId,
        topicoId,
        tipoCurso,
        estado,
        nivel,
        imagemBanner,
      });
      res.json({ success: true, data: curso });
    } else {
      res.status(404).json({ message: "Curso não encontrado." });
    }
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar curso.", details: error.message });
  }
};

// Apagar curso
controllers.curso_delete = async (req, res) => {
  const { id } = req.params;

  try {
    const curso = await Curso.findByPk(id);

    if (!curso) {
      return res.status(404).json({ error: "Curso não encontrado" });
    }

    await curso.destroy(); 

    res.json({ success: true, message: "Curso apagado com sucesso" });
  } catch (error) {
    console.log("Erro ao apagar curso", error);
    res.status(500).json({ message: "Erro ao apagar o curso", details: error.message});
  }
};

module.exports = controllers;