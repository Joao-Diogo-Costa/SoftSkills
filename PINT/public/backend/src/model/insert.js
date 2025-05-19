const sequelize = require("./database");

// Importa todos os modelos na ordem correta
const AreaC = require("./AreaC");
const AulaSincrona = require("./AulaSincrona");
const AulaAssincrona = require("./AulaAssincrona");
const AvaliacaoCursoUtilizador = require("./AvaliacaoCursoUtilizador");
const AvisoCurso = require("./AvisoCurso");
const CategoriaC = require("./CategoriaC");
const Certificado = require("./Certificado");
const Comentario = require("./Comentario");
const Conteudo = require("./Conteudo");
const Curso = require("./Curso");
const Denuncia = require("./Denuncia");
const DocumentoAula = require("./DocumentoAula");
const Forum = require("./Forum");
const Inscricao = require("./Inscricao");
const Notificacao = require("./Notificacao");
const SubmissaoTarefa = require("./SubmissaoTarefa");
const SugestaoForum = require("./SugestaoForum");
const Tarefa = require("./Tarefa");
const TopicoC = require("./TopicoC");
const Utilizador = require("./Utilizador");


const bcrypt = require("bcrypt");

async function initializeData() {
  try {
    const checkAndInsert = async (model, data) => {
      try {
        const count = await model.count();
        console.log(`Checking ${model.name}, count: ${count}`);

        if (count === 0) {
          // Itera sobre os dados e insere um por um na ordem fornecida
          for (let i = 0; i < data.length; i++) {
            await model.create(data[i]);
          }
          console.log(`Data inserted into ${model.name}`);
        } else {
          console.log(
            `${model.name} already contains data. Skipping insertion.`
          );
        }
      } catch (err) {
        console.error(`Error with model ${model.name}:`, err);
        throw err; // Re-throw the error after logging it
      }
    };

    await checkAndInsert(Utilizador, [
      //Admin
      {
        nomeUtilizador: "admin",
        dataNasc: "2025-01-01",
        nTel: "123456789",
        email: "admin@admin.softinsa",
        emailConfirmado: true,
        tokenConfirmacaoEmail: null,
        password: await bcrypt.hash("admin123", 10),
        mustChangePassword: false,
        imagemPerfil: null,
        pontos: 0,
        role: "gestor",
        dataRegisto: new Date(),
      },
      // Formadores
      {
        nomeUtilizador: "Ana Martins",
        dataNasc: "2025-01-01",
        nTel: "912544355",
        email: "ana.martins@formador.softinsa",
        emailConfirmado: false,
        tokenConfirmacaoEmail: null,
        password: await bcrypt.hash("formador123", 10),
        mustChangePassword: true,
        imagemPerfil: null,
        pontos: 0,
        role: "formador",
        dataRegisto: new Date(),
      },
      {
        nomeUtilizador: "Ricardo Sousa",
        dataNasc: "2025-01-01",
        nTel: "921453898",
        email: "ricardo.sousa@formador.softinsa",
        emailConfirmado: false,
        tokenConfirmacaoEmail: null,
        password: await bcrypt.hash("formador123", 10),
        mustChangePassword: true,
        imagemPerfil: null,
        pontos: 0,
        role: "formador",
        dataRegisto: new Date(),
      },
      {
        nomeUtilizador: "Tiago Alves",
        dataNasc: "2025-01-01",
        nTel: "935602918",
        email: "tiago.alves@formador.softinsa",
        emailConfirmado: false,
        tokenConfirmacaoEmail: null,
        password: await bcrypt.hash("formador123", 10),
        mustChangePassword: true,
        imagemPerfil: null,
        pontos: 0,
        role: "formador",
        dataRegisto: new Date(),
      },
      {
        nomeUtilizador: "Sofia Gomes",
        dataNasc: "2025-01-01",
        nTel: "924859109",
        email: "sofia.gomes@formador.softinsa",
        emailConfirmado: false,
        tokenConfirmacaoEmail: null,
        password: await bcrypt.hash("formador123", 10),
        mustChangePassword: true,
        imagemPerfil: null,
        pontos: 0,
        role: "formador",
        dataRegisto: new Date(),
      },
      {
        nomeUtilizador: "Carlos Almeida",
        dataNasc: "2025-01-01",
        nTel: "914627839",
        email: "carlos.almeida@formador.softinsa",
        emailConfirmado: false,
        tokenConfirmacaoEmail: null,
        password: await bcrypt.hash("formador123", 10),
        mustChangePassword: true,
        imagemPerfil: null,
        pontos: 0,
        role: "formador",
        dataRegisto: new Date(),
      },
      // Formandos
      {
        nomeUtilizador: "Ricardo Silva",
        dataNasc: "2025-01-01",
        nTel: "917382901",
        email: "ricardo.silva@formando.softinsa",
        emailConfirmado: false,
        tokenConfirmacaoEmail: null,
        password: await bcrypt.hash("formando123", 10),
        mustChangePassword: true,
        imagemPerfil: null,
        pontos: 0,
        role: "formando",
        dataRegisto: new Date(),
      },
      {
        nomeUtilizador: "Inês Andrade",
        dataNasc: "2025-01-01",
        nTel: "920374501",
        email: "ines.andrade@formando.softinsa",
        emailConfirmado: false,
        tokenConfirmacaoEmail: null,
        password: await bcrypt.hash("formando123", 10),
        mustChangePassword: true,
        imagemPerfil: null,
        pontos: 0,
        role: "formando",
        dataRegisto: new Date(),
      },
      {
        nomeUtilizador: "Miguel Rocha",
        dataNasc: "2025-01-01",
        nTel: "934618203",
        email: "miguel.rocha@formando.softinsa",
        emailConfirmado: false,
        tokenConfirmacaoEmail: null,
        password: await bcrypt.hash("formando123", 10),
        mustChangePassword: true,
        imagemPerfil: null,
        pontos: 0,
        role: "formando",
        dataRegisto: new Date(),
      },
      {
        nomeUtilizador: "Tiago Lopes",
        dataNasc: "2025-01-01",
        nTel: "927381046",
        email: "tiago.lopes@formando.softinsa",
        emailConfirmado: false,
        tokenConfirmacaoEmail: null,
        password: await bcrypt.hash("formando123", 10),
        mustChangePassword: true,
        imagemPerfil: null,
        pontos: 0,
        role: "formando",
        dataRegisto: new Date(),
      },
      {
        nomeUtilizador: "Diogo Marques",
        dataNasc: "2025-01-01",
        nTel: "936280365",
        email: "diogo.marques@formando.softinsa",
        emailConfirmado: false,
        tokenConfirmacaoEmail: null,
        password: await bcrypt.hash("formando123", 10),
        mustChangePassword: true,
        imagemPerfil: null,
        pontos: 0,
        role: "formando",
        dataRegisto: new Date(),
      },
    ]);

    await checkAndInsert(CategoriaC, [
      {
        nome: "Tecnologia e Programação",
      },
      {
        nome: "Negócios e Gestão",
      },
      {
        nome: "Design",
      },
      {
        nome: "Educação",
      },
      {
        nome: "Ciência",
      },
    ]);

    await checkAndInsert(AreaC, [
      {
        nome: "Desenvolvimento Web",
        categoriaId: 1,
      },
      {
        nome: "Desenvolvimento Mobile",
        categoriaId: 1,
      },
      {
        nome: "Desenvolvimento de jogos",
        categoriaId: 1,
      },
      {
        nome: "Data Science",
        categoriaId: 1,
      },
      {
        nome: "Redes",
        categoriaId: 1,
      },

      {
        nome: "Marketing Digital",
        categoriaId: 2,
      },
      {
        nome: "Gestão de Projetos",
        categoriaId: 2,
      },
      {
        nome: "Empreendedorismo",
        categoriaId: 2,
      },
      {
        nome: "Finanças e Contabilidade",
        categoriaId: 2,
      },
      {
        nome: "Recursos Humanos",
        categoriaId: 2,
      },

      {
        nome: "Design Gráfico",
        categoriaId: 3,
      },
      {
        nome: "UI/UX Design",
        categoriaId: 3,
      },
      {
        nome: "Fotografia",
        categoriaId: 3,
      },
      {
        nome: "Vídeo e Edição",
        categoriaId: 3,
      },
      {
        nome: "Animação",
        categoriaId: 3,
      },

      {
        nome: "Ensino Fundamental",
        categoriaId: 4,
      },
      {
        nome: "Ensino Superior",
        categoriaId: 4,
      },
      {
        nome: "Formação de Professores",
        categoriaId: 4,
      },
      {
        nome: "Filosofia da Educação",
        categoriaId: 4,
      },
      {
        nome: "Linguística Aplicada à Educação",
        categoriaId: 4,
      },
      {
        nome: "Física Quântica",
        categoriaId: 5,
      },
      {
        nome: "Biologia Molecular",
        categoriaId: 5,
      },
      {
        nome: "Física Aplicada",
        categoriaId: 5,
      },
      {
        nome: "Matemática Discreta",
        categoriaId: 5,
      },
      {
        nome: "Estatística",
        categoriaId: 5,
      },
    ]);

    await checkAndInsert(TopicoC, [
      // Tópicos para Desenvolvimento Web (areaId: 1)
      {
        nomeTopico: "HTML Semântico",
        areaId: 1,
      },
      {
        nomeTopico: "CSS",
        areaId: 1,
      },
      {
        nomeTopico: "JavaScript",
        areaId: 1,
      },
      {
        nomeTopico: "Frameworks Front-end (React, Angular, Vue)",
        areaId: 1,
      },
      {
        nomeTopico: "Back-end com Node.js e Express",
        areaId: 1,
      },

      // Tópicos para Desenvolvimento Mobile (areaId: 2)
      {
        nomeTopico: "Desenvolvimento Nativo (Kotlin/Java, Swift/Objective-C)",
        areaId: 2,
      },
      {
        nomeTopico: "Desenvolvimento Híbrido (React Native, Flutter)",
        areaId: 2,
      },
      {
        nomeTopico: "Testes em Aplicações Mobile",
        areaId: 2,
      },
      {
        nomeTopico: "Publicação em Lojas",
        areaId: 2,
      },

      // Tópicos para Desenvolvimento de jogos (areaId: 3)
      {
        nomeTopico: "Motores de Jogo (Unity, Unreal Engine, Godot)",
        areaId: 3,
      },
      {
        nomeTopico: "Linguagens de Programação para Jogos (C#, C++, Lua)",
        areaId: 3,
      },
      {
        nomeTopico: "Design de Jogos",
        areaId: 3,
      },
      {
        nomeTopico: "Animação e Gráficos para Jogos",
        areaId: 3,
      },

      // Tópicos para Data Science (areaId: 4)
      {
        nomeTopico: "Python para Data Science (Pandas, NumPy, Scikit-learn)",
        areaId: 4,
      },
      {
        nomeTopico: "Visualização de Dados (Matplotlib, Seaborn, Plotly)",
        areaId: 4,
      },
      {
        nomeTopico: "Machine Learning",
        areaId: 4,
      },
      {
        nomeTopico: "Estatística para Data Science",
        areaId: 4,
      },

      // Tópicos para Redes (areaId: 5)
      {
        nomeTopico: "Protocolos de Rede (TCP/IP, HTTP, DNS)",
        areaId: 5,
      },
      {
        nomeTopico: "Arquitetura de Redes (LAN, WAN)",
        areaId: 5,
      },
      {
        nomeTopico: "Segurança de Redes (Firewalls, VPNs)",
        areaId: 5,
      },
      {
        nomeTopico: "Administração de Servidores",
        areaId: 5,
      },

      // Tópicos para Marketing Digital (areaId: 6)
      {
        nomeTopico: "SEO (Otimização para Motores de Busca)",
        areaId: 6,
      },
      {
        nomeTopico: "Marketing de Conteúdo",
        areaId: 6,
      },
      {
        nomeTopico: "Marketing de Redes Sociais",
        areaId: 6,
      },
      {
        nomeTopico: "Publicidade Online (Google Ads, Facebook Ads)",
        areaId: 6,
      },

      // Tópicos para Gestão de Projetos (areaId: 7)
      {
        nomeTopico: "Metodologias Ágeis (Scrum, Kanban)",
        areaId: 7,
      },
      {
        nomeTopico: "Planejamento de Projetos",
        areaId: 7,
      },
      {
        nomeTopico: "Gerenciamento de Riscos",
        areaId: 7,
      },
      {
        nomeTopico: "Comunicação em Projetos",
        areaId: 7,
      },

      // Tópicos para Empreendedorismo (areaId: 8)
      {
        nomeTopico: "Plano de Negócios",
        areaId: 8,
      },
      {
        nomeTopico: "Validação de Ideias",
        areaId: 8,
      },
      {
        nomeTopico: "Marketing para Empreendedores",
        areaId: 8,
      },
      {
        nomeTopico: "Financiamento e Investimento",
        areaId: 8,
      },

      // Tópicos para Finanças e Contabilidade (areaId: 9)
      {
        nomeTopico: "Contabilidade Básica",
        areaId: 9,
      },
      {
        nomeTopico: "Análise Financeira",
        areaId:9,     
      },
      {
        nomeTopico: "Impostos e Legislação Tributária",
        areaId: 9,
      },
      {
        nomeTopico: "Gestão Financeira Empresarial",
        areaId: 9,
      },

      // Tópicos para Recursos Humanos (areaId: 10)
      {
        nomeTopico: "Recrutamento e Seleção",
        areaId: 10,
      },
      {
        nomeTopico: "Treinamento e Desenvolvimento",
        areaId: 10,
      },
      {
        nomeTopico: "Avaliação de Desempenho",
        areaId: 10,
      },
      {
        nomeTopico: "Gestão de Carreiras",
        areaId: 10,
      },

      // Tópicos para Design Gráfico (areaId: 11)
      {
        nomeTopico: "Teoria das Cores",
        areaId: 11,
      },
      {
        nomeTopico: "Tipografia",
        areaId: 11,
      },
      {
        nomeTopico: "Adobe Photoshop",
        areaId: 11,
      },
      {
        nomeTopico: "Adobe Illustrator",
        areaId: 11,
      },

      // Tópicos para UI/UX Design (areaId: 12)
      {
        nomeTopico: "Arquitetura da Informação",
        areaId: 12,
      },
      {
        nomeTopico: "Wireframing e Prototipagem",
        areaId: 12,
      },
      {
        nomeTopico: "Testes de Usabilidade",
        areaId: 12,
      },
      {
        nomeTopico: "Design Thinking",
        areaId: 12,
      },

      // Tópicos para Fotografia (areaId: 13)
      {
        nomeTopico: "Técnicas de Iluminação",
        areaId: 13,
      },
      {
        nomeTopico: "Composição Fotográfica",
        areaId: 13,
      },
      {
        nomeTopico: "Edição de Imagens (Lightroom, Photoshop)",
        areaId: 13,
      },
      {
        nomeTopico: "Fotografia de Retrato",
        areaId: 13,
      },

      // Tópicos para Vídeo e Edição (areaId: 14)
      {
        nomeTopico: "Técnicas de Filmagem",
        areaId: 14,
      },
      {
        nomeTopico: "Edição de Vídeo (Premiere Pro, Final Cut Pro)",
        areaId: 14,
      },
      {
        nomeTopico: "Roteiro e Storyboard",
        areaId: 14,
      },
      {
        nomeTopico: "Motion Graphics",
        areaId: 14,
      },

      // Tópicos para Animação (areaId: 15)
      {
        nomeTopico: "Princípios da Animação",
        areaId: 15,
      },
      {
        nomeTopico: "Animação 2D (Toon Boom, Adobe Animate)",
        areaId: 15,
      },
      {
        nomeTopico: "Animação 3D (Blender, Maya)",
        areaId: 15,
      },
      {
        nomeTopico: "Stop Motion",
        areaId: 15,
      },

      // Tópicos para Ensino Fundamental (areaId: 16)
      {
        nomeTopico: "Alfabetização e Letramento",
        areaId: 16,
      },
      {
        nomeTopico: "Operações Matemáticas Básicas",
        areaId: 16,
      },
      {
        nomeTopico: "Conceitos de Ciências Naturais (Corpo Humano, Animais, Plantas)",
        areaId: 16,
      },
      {
        nomeTopico: "História do Brasil e do Mundo",
        areaId: 16,
      },

      // Tópicos para Ensino Superior (areaId: 17)
      {
        nomeTopico: "Metodologia Científica",
        areaId: 17,
      },
      {
        nomeTopico: "Redação Acadêmica",
        areaId: 17,
      },
      {
        nomeTopico: "Estatística Aplicada",
        areaId: 17,
      },
      {
        nomeTopico: "Pensamento Crítico",
        areaId: 17,
      },

      // Tópicos para Formação de Professores (areaId: 18)
      {
        nomeTopico: "Teorias da Aprendizagem",
        areaId: 18,
      },
      {
        nomeTopico: "Planejamento de Aulas e Currículo",
        areaId: 18,
      },
      {
        nomeTopico: "Avaliação Formativa e Somativa",
        areaId: 18,
      },
      {
        nomeTopico: "Gestão de Sala de Aula",
        areaId: 18,
      },

      // Tópicos para Filosofia da Educação (areaId: 19)
      {
        nomeTopico: "Filosofia Clássica e Educação",
        areaId: 19,
      },
      {
        nomeTopico: "Filosofia Moderna e Educação",
        areaId: 19,
      },
      {
        nomeTopico: "Ética e Educação",
        areaId: 19,
      },
      {
        nomeTopico: "Epistemologia e Educação",
        areaId: 19,
      },

      // Tópicos para Linguística Aplicada à Educação (areaId: 20)
      {
        nomeTopico: "Aquisição da Linguagem",
        areaId: 20,
      },
      {
        nomeTopico: "Ensino de Línguas Estrangeiras",
        areaId: 20,
      },
      {
        nomeTopico: "Análise do Discurso em Contextos Educacionais",
        areaId: 20,
      },
      {
        nomeTopico: "Sociolinguística Educacional",
        areaId: 20,
      },

      // Tópicos para Física Quântica (areaId: 21)
      {
        nomeTopico: "Mecânica Quântica Fundamental",
        areaId: 21,
      },
      {
        nomeTopico: "Teoria Quântica de Campos",
        areaId: 21,
      },
      {
        nomeTopico: "Informação Quântica",
        areaId: 21,
      },
      {
        nomeTopico: "Interpretações da Mecânica Quântica",
        areaId: 21,
      },

      // Tópicos para Biologia Molecular (areaId: 22)
      {
        nomeTopico: "Estrutura e Função de Ácidos Nucleicos (DNA e RNA)",
        areaId: 22,
      },
      {
        nomeTopico: "Replicação, Transcrição e Tradução",
        areaId: 22,
      },
      {
        nomeTopico: "Engenharia Genética e Biotecnologia",
        areaId: 22,
      },
      {
        nomeTopico: "Regulação da Expressão Gênica",
        areaId: 22,
      },

      // Tópicos para Física Aplicada (areaId: 23)
      {
        nomeTopico: "Mecânica dos Fluidos",
        areaId: 23,
      },
      {
        nomeTopico: "Termodinâmica Aplicada",
        areaId: 23,
      },
      {
        nomeTopico: "Óptica e Lasers",
        areaId: 23,
      },
      {
        nomeTopico: "Física do Estado Sólido",
        areaId: 23,
      },

      // Tópicos para Matemática Discreta (areaId: 24)
      {
        nomeTopico: "Lógica Proposicional e Predicados",
        areaId: 24,
      },
      {
        nomeTopico: "Teoria dos Conjuntos",
        areaId: 24,
      },
      {
        nomeTopico: "Combinatória",
        areaId: 24,
      },
      {
        nomeTopico: "Grafos",
        areaId: 24,
      },

      // Tópicos para Estatística (areaId: 25)
      {
        nomeTopico: "Estatística Descritiva",
        areaId: 25,
      },
      {
        nomeTopico: "Probabilidade",
        areaId: 25,
      },
      {
        nomeTopico: "Inferência Estatística",
        areaId: 25,
      },
      {
        nomeTopico: "Regressão Linear",
        areaId: 25,
      },
    ]);

    const hoje = new Date();
    const dataLimite = new Date(hoje);
    dataLimite.setMonth(dataLimite.getMonth() + 1);

    await checkAndInsert(Curso, [

      {
        nome: "HTML Semântico - Básico",
        dataUpload: new Date(),
        tipoCurso: "Online",
        vaga: null,
        dataLimiteInscricao: dataLimite,
        estado: 1,
        descricaoCurso: "Curso introdutório sobre HTML Semântico.",
        duracao: "02:00:00",
        nivel: "Básico",
        pontuacao: 100,
        imagemBanner: null,
        topicoId: 1,
      },
      {
        nome: "HTML Semântico - Intermediário",
        dataUpload: new Date(),
        tipoCurso: "Presencial",
        vaga: 30,
        dataLimiteInscricao: dataLimite,
        estado: 1,
        descricaoCurso: "Curso intermediário de práticas semânticas em HTML.",
        duracao: "02:00:00",
        nivel: "Intermediário",
        pontuacao: 250,
        imagemBanner: null,
        topicoId: 1,
      },
      {
        nome: "HTML Semântico - Avançado",
        dataUpload: new Date(),
        tipoCurso: "Online",
        vaga: null,
        dataLimiteInscricao: dataLimite,
        estado: 1,
        descricaoCurso: "Curso avançado de HTML Semântico.",
        duracao: "02:00:00",
        nivel: "Avançado",
        pontuacao: 500,
        imagemBanner: null,
        topicoId: 1,
      },
      {
        nome: "CSS - Básico",
        dataUpload: new Date(),
        tipoCurso: "Online",
        vaga: null,
        dataLimiteInscricao: dataLimite,
        estado: 1,
        descricaoCurso: "Aprende os fundamentos do CSS.",
        duracao: "02:00:00",
        nivel: "Básico",
        pontuacao: 110,
        imagemBanner: null,
        topicoId: 2,
      },
      {
        nome: "CSS - Intermediário",
        dataUpload: new Date(),
        tipoCurso: "Presencial",
        vaga: 30,
        dataLimiteInscricao: dataLimite,
        estado: 1,
        descricaoCurso: "Curso de CSS focado em layouts responsivos.",
        duracao: "02:00:00",
        nivel: "Intermediário",
        pontuacao: 120,
        imagemBanner: null,
        topicoId: 2,
      },
      {
        nome: "CSS - Avançado",
        dataUpload: new Date(),
        tipoCurso: "Online",
        vaga: null,
        dataLimiteInscricao: dataLimite,
        estado: 1,
        descricaoCurso: "Curso avançado de CSS com animações e pré-processadores.",
        duracao: "02:00:00",
        nivel: "Avançado",
        pontuacao: 130,
        imagemBanner: null,
        topicoId: 2,
      },

      // Cursos para JavaScript
      {
        nome: "JavaScript - Básico",
        dataUpload: new Date(),
        tipoCurso: "Online",
        vaga: null,
        dataLimiteInscricao: dataLimite,
        estado: 1,
        descricaoCurso: "Introdução à programação com JavaScript.",
        duracao: "02:00:00",
        nivel: "Básico",
        pontuacao: 110,
        imagemBanner: null,
        topicoId: 3,
      },
      {
        nome: "JavaScript - Intermediário",
        dataUpload: new Date(),
        tipoCurso: "Presencial",
        vaga: 30,
        dataLimiteInscricao: dataLimite,
        estado: 1,
        descricaoCurso: "Curso de JavaScript com foco em DOM e eventos.",
        duracao: "02:00:00",
        nivel: "Intermediário",
        pontuacao: 120,
        imagemBanner: null,
        topicoId: 3,
      },
      {
        nome: "JavaScript - Avançado",
        dataUpload: new Date(),
        tipoCurso: "Online",
        vaga: null,
        dataLimiteInscricao: dataLimite,
        estado: 1,
        descricaoCurso: "Curso avançado de JavaScript moderno (ES6+).",
        duracao: "02:00:00",
        nivel: "Avançado",
        pontuacao: 130,
        imagemBanner: null,
        topicoId: 3,
      },

      // Cursos para Frameworks Front-end
      {
        nome: "Frameworks Front-end - Básico",
        dataUpload: new Date(),
        tipoCurso: "Online",
        vaga: null,
        dataLimiteInscricao: dataLimite,
        estado: 1,
        descricaoCurso: "Introdução ao React, Angular e Vue.",
        duracao: "02:00:00",
        nivel: "Básico",
        pontuacao: 110,
        imagemBanner: null,
        topicoId: 4,
      },
      {
        nome: "Frameworks Front-end - Intermediário",
        dataUpload: new Date(),
        tipoCurso: "Presencial",
        vaga: 30,
        dataLimiteInscricao: dataLimite,
        estado: 1,
        descricaoCurso: "Curso prático com React e componentes.",
        duracao: "02:00:00",
        nivel: "Intermediário",
        pontuacao: 120,
        imagemBanner: null,
        topicoId: 4,
      },
      {
        nome: "Frameworks Front-end - Avançado",
        dataUpload: new Date(),
        tipoCurso: "Online",
        vaga: null,
        dataLimiteInscricao: dataLimite,
        estado: 1,
        descricaoCurso: "Curso avançado: estados globais, roteamento e testes.",
        duracao: "02:00:00",
        nivel: "Avançado",
        pontuacao: 130,
        imagemBanner: null,
        topicoId: 4,
      },

      // Cursos para Back-end com Node.js e Express
      {
        nome: "Node.js e Express - Básico",
        dataUpload: new Date(),
        tipoCurso: "Online",
        vaga: null,
        dataLimiteInscricao: dataLimite,
        estado: 1,
        descricaoCurso: "Começa a criar servidores com Node.js.",
        duracao: "02:00:00",
        nivel: "Básico",
        pontuacao: 110,
        imagemBanner: null,
        topicoId: 5,
      },
      {
        nome: "Node.js e Express - Intermediário",
        dataUpload: new Date(),
        tipoCurso: "Presencial",
        vaga: 30,
        dataLimiteInscricao: dataLimite,
        estado: 1,
        descricaoCurso: "Constrói APIs REST com Express.js.",
        duracao: "02:00:00",
        nivel: "Intermediário",
        pontuacao: 120,
        imagemBanner: null,
        topicoId: 5,
      },
      {
        nome: "Node.js e Express - Avançado",
        dataUpload: new Date(),
        tipoCurso: "Online",
        vaga: null,
        dataLimiteInscricao: dataLimite,
        estado: 1,
        descricaoCurso: "Curso avançado: autenticação, middlewares e JWT.",
        duracao: "02:00:00",
        nivel: "Avançado",
        pontuacao: 130,
        imagemBanner: null,
        topicoId: 5,
      },
      
    ]);

    await checkAndInsert(AulaSincrona, [

      {
        tituloSincrona: "Revisão de HTML Semântico Básico",
        descricaoSincrona: "Revisão rápida dos conceitos básicos para alinhar conhecimento.",
        dataLancSincrona: new Date(),
        cursoId: 2,
      },
      {
        tituloSincrona: "Estrutura Avançada com HTML5",
        descricaoSincrona: "Exploração de elementos avançados e melhores práticas semânticas.",
        dataLancSincrona: new Date(),
        cursoId: 2,
      },

      {
        tituloSincrona: "Projetos Práticos e Validação",
        descricaoSincrona: "Desenvolvimento de projetos e uso de ferramentas para validação semântica.",
        dataLancSincrona: new Date(),
        cursoId: 2,
      },
        {
        tituloSincrona: "Fundamentos de Layout Responsivo",
        descricaoSincrona: "Introdução aos conceitos de design responsivo usando CSS.",
        dataLancSincrona: new Date(),
        cursoId: 5,
      },
      {
        tituloSincrona: "Flexbox e Grid Avançado",
        descricaoSincrona: "Exploração aprofundada das técnicas Flexbox e CSS Grid para layouts complexos.",
        dataLancSincrona: new Date(),
        cursoId: 5,
      },
      {
        tituloSincrona: "Media Queries e Otimização Mobile",
        descricaoSincrona: "Uso avançado de media queries para otimização em dispositivos móveis.",
        dataLancSincrona: new Date(),
        cursoId: 5,
      },
      {
        tituloSincrona: "Manipulação do DOM",
        descricaoSincrona: "Aprenda como acessar e modificar elementos HTML com JavaScript.",
        dataLancSincrona: new Date(),
        cursoId: 8,
      },
      {
        tituloSincrona: "Eventos em JavaScript",
        descricaoSincrona: "Entenda o sistema de eventos, listeners e bubbling.",
        dataLancSincrona: new Date(),
        cursoId: 8,
      },
      {
        tituloSincrona: "Práticas com Manipulação e Eventos",
        descricaoSincrona: "Desenvolvimento de pequenos projetos para aplicar DOM e eventos.",
        dataLancSincrona: new Date(),
        cursoId: 8,
      },
      {
        tituloSincrona: "Introdução ao React",
        descricaoSincrona: "Fundamentos do React, JSX e componentes funcionais.",
        dataLancSincrona: new Date(),
        cursoId: 11,
      },
      {
        tituloSincrona: "Gerenciamento de Estado",
        descricaoSincrona: "Uso do useState, Context API e Redux para gerenciamento de estado.",
        dataLancSincrona: new Date(),
        cursoId: 11,
      },
      {
        tituloSincrona: "Componentes Avançados e Hooks",
        descricaoSincrona: "Hooks personalizados e otimização de componentes React.",
        dataLancSincrona: new Date(),
        cursoId: 11,
      },

      // Aulas para Node.js e Express - Intermediário (cursoId: 14)
      {
        tituloSincrona: "Introdução ao Express.js",
        descricaoSincrona: "Configuração de servidor, rotas e middleware no Express.",
        dataLancSincrona: new Date(),
        cursoId: 14,
      },
      {
        tituloSincrona: "CRUD com MongoDB e Express",
        descricaoSincrona: "Criação de APIs RESTful conectando Express com banco MongoDB.",
        dataLancSincrona: new Date(),
        cursoId: 14,
      },
      {
        tituloSincrona: "Autenticação e Segurança",
        descricaoSincrona: "Implementação de autenticação JWT e práticas de segurança.",
        dataLancSincrona: new Date(),
        cursoId: 14,
      },



    ]);

    await checkAndInsert(AulaAssincrona, [

      {
        tituloAssincrona: "O que é HTML Semântico?",
        descricaoAssincrona: "Explicação sobre o conceito de semântica no HTML e sua importância.",
        dataLancAssincrona: new Date(),
        cursoId: 1,
      },
      {
        tituloAssincrona: "Tags Semânticas Essenciais",
        descricaoAssincrona: "Descrição das principais tags semânticas como <header>, <main>, <article>, <section>.",
        dataLancAssincrona: new Date(),
        cursoId: 1,
      },
      {
        tituloAssincrona: "Construindo uma Página com Semântica",
        descricaoAssincrona: "Criação prática de uma página HTML com uso correto de semântica.",
        dataLancAssincrona: new Date(),
        cursoId: 1,
      },
      {
        tituloAssincrona: "Acessibilidade e HTML Semântico",
        descricaoAssincrona: "Integração de HTML semântico com práticas de acessibilidade para web.",
        dataLancAssincrona: new Date(),
        cursoId: 3,
      },
      {
        tituloAssincrona: "SEO e Estrutura Semântica",
        descricaoAssincrona: "Como a estrutura semântica melhora o SEO e o rastreamento de páginas.",
        dataLancAssincrona: new Date(),
        cursoId: 3,
      },
      {
        tituloAssincrona: "Padrões W3C e Validação Profunda",
        descricaoAssincrona: "Aplicação de normas W3C em projetos e validação avançada de código.",
        dataLancAssincrona: new Date(),
        cursoId: 3,
      },

      {
        tituloAssincrona: "Introdução ao CSS",
        descricaoAssincrona: "Explicação dos conceitos básicos de CSS e como aplicá-lo em páginas HTML.",
        dataLancAssincrona: new Date(),
        cursoId: 4,
      },
      {
        tituloAssincrona: "Seletores e Propriedades",
        descricaoAssincrona: "Uso de seletores CSS e propriedades comuns como cor, margem e padding.",
        dataLancAssincrona: new Date(),
        cursoId: 4,
      },
      {
        tituloAssincrona: "Classes, IDs e Cascata",
        descricaoAssincrona: "Diferença entre classes e IDs, e como o CSS lida com hierarquia e cascata.",
        dataLancAssincrona: new Date(),
        cursoId: 4,
      },

      {
        tituloAssincrona: "Animações e Transições com CSS",
        descricaoAssincrona: "Aprende a criar efeitos visuais suaves usando animações e transições em CSS.",
        dataLancAssincrona: new Date(),
        cursoId: 6,
      },
      {
        tituloAssincrona: "Flexbox e Grid Layout",
        descricaoAssincrona: "Exploração profunda dos sistemas de layout modernos no CSS.",
        dataLancAssincrona: new Date(),
        cursoId: 6,
      },
      {
        tituloAssincrona: "Pré-processadores: SASS e LESS",
        descricaoAssincrona: "Introdução ao uso de pré-processadores CSS para código mais limpo e escalável.",
        dataLancAssincrona: new Date(),
        cursoId: 6,
      },

      {
        tituloAssincrona: "Introdução ao JavaScript",
        descricaoAssincrona: "Apresentação da linguagem JavaScript, sua história e aplicações.",
        dataLancAssincrona: new Date(),
        cursoId: 7,
      },
      {
        tituloAssincrona: "Variáveis, Tipos e Operadores",
        descricaoAssincrona: "Aprende a declarar variáveis, identificar tipos de dados e usar operadores.",
        dataLancAssincrona: new Date(),
        cursoId: 7,
      },
      {
        tituloAssincrona: "Funções e Controle de Fluxo",
        descricaoAssincrona: "Conceitos iniciais de funções, condicionais e estruturas de repetição.",
        dataLancAssincrona: new Date(),
        cursoId: 7,
      },
      {
        tituloAssincrona: "Conceitos Avançados de ES6+",
        descricaoAssincrona: "Exploração de funcionalidades modernas como arrow functions, let/const, e template literals.",
        dataLancAssincrona: new Date(),
        cursoId: 9,
      },
      {
        tituloAssincrona: "Promises e Async/Await",
        descricaoAssincrona: "Entende o funcionamento assíncrono do JavaScript com Promises e async/await.",
        dataLancAssincrona: new Date(),
        cursoId: 9,
      },
      {
        tituloAssincrona: "Módulos e Webpack",
        descricaoAssincrona: "Organiza código com módulos ES6 e configura o Webpack para projetos modernos.",
        dataLancAssincrona: new Date(),
        cursoId: 9,
      },

      {
        tituloAssincrona: "Introdução ao React",
        descricaoAssincrona: "Conceitos básicos, JSX e criação de componentes em React.",
        dataLancAssincrona: new Date(),
        cursoId: 10,
      },
      {
        tituloAssincrona: "Fundamentos do Angular",
        descricaoAssincrona: "Criação de componentes, diretivas e estrutura básica de um projeto Angular.",
        dataLancAssincrona: new Date(),
        cursoId: 10,
      },
      {
        tituloAssincrona: "Vue.js para Iniciantes",
        descricaoAssincrona: "Primeiros passos com Vue, vinculação de dados e métodos.",
        dataLancAssincrona: new Date(),
        cursoId: 10,
      },
      {
        tituloAssincrona: "Gerenciamento de Estado com Redux e Context API",
        descricaoAssincrona: "Aprende a lidar com estados globais em React de forma eficiente.",
        dataLancAssincrona: new Date(),
        cursoId: 12,
      },
      {
        tituloAssincrona: "Roteamento Avançado com React Router e Angular Router",
        descricaoAssincrona: "Implementação de rotas protegidas, parâmetros dinâmicos e lazy loading.",
        dataLancAssincrona: new Date(),
        cursoId: 12,
      },
      {
        tituloAssincrona: "Testes Automatizados com Jest e Cypress",
        descricaoAssincrona: "Escrevendo testes de unidade e testes end-to-end em aplicações front-end.",
        dataLancAssincrona: new Date(),
        cursoId: 12,
      },

      {
        tituloAssincrona: "Introdução ao Node.js",
        descricaoAssincrona: "Conhece o ambiente Node.js, V8 e o runtime fora do navegador.",
        dataLancAssincrona: new Date(),
        cursoId: 13,
      },
      {
        tituloAssincrona: "Criando um Servidor com HTTP",
        descricaoAssincrona: "Criação manual de um servidor usando o módulo http do Node.js.",
        dataLancAssincrona: new Date(),
        cursoId: 13,
      },
      {
        tituloAssincrona: "Primeiros Passos com Express",
        descricaoAssincrona: "Instalação e uso básico do framework Express para rotas simples.",
        dataLancAssincrona: new Date(),
        cursoId: 13,
      },
      {
        tituloAssincrona: "Middlewares Personalizados",
        descricaoAssincrona: "Aprende a criar e aplicar middlewares em rotas com Express.",
        dataLancAssincrona: new Date(),
        cursoId: 15,
      },
      {
        tituloAssincrona: "Autenticação com JWT",
        descricaoAssincrona: "Implementa autenticação segura com JSON Web Tokens.",
        dataLancAssincrona: new Date(),
        cursoId: 15,
      },
      {
        tituloAssincrona: "Protegendo Rotas e Autorização",
        descricaoAssincrona: "Como proteger endpoints e controlar permissões com Express.",
        dataLancAssincrona: new Date(),
        cursoId: 15,
      },

    ]);

    await checkAndInsert(Tarefa, [
        {
          titulo: "Exercício de Revisão HTML Básico",
          descricao: "Complete os exercícios de revisão sobre HTML Semântico Básico.",
          dataLimite: new Date(new Date().setDate(new Date().getDate() + 7)), // 7 dias a partir de hoje
          ficheiroEnunciado: "exercicio_html_basico.pdf",
          idAulaSinc: 1, 
        },
        {
          titulo: "Projeto Estrutura Avançada",
          descricao: "Desenvolva um projeto aplicando elementos avançados do HTML5.",
          dataLimite: new Date(new Date().setDate(new Date().getDate() + 10)), // 10 dias a partir de hoje
          ficheiroEnunciado: "projeto_html_avancado.pdf",
          idAulaSinc: 1,
        },
        {
          titulo: "Validação e Melhores Práticas",
          descricao: "Utilize ferramentas para validar seu código e aplicar boas práticas.",
          dataLimite: new Date(new Date().setDate(new Date().getDate() + 5)), // 5 dias a partir de hoje
          ficheiroEnunciado: null,
          idAulaSinc: 1,
        },

    ]);

    // await checkAndInsert(SubmissaoTarefa, []);

    // await checkAndInsert(Forum, []);

    // await checkAndInsert(Comentario, []);

    // await checkAndInsert(Denuncia, []);

    // await checkAndInsert(DocumentoAula, []);

    // await checkAndInsert(Conteudo, []);

    // await checkAndInsert(Inscricao, []);

    // await checkAndInsert(AvaliacaoCursoUtilizador, []);

    // await checkAndInsert(AvisoCurso, []);

    // await checkAndInsert(Certificado, []);

    // await checkAndInsert(Notificacao, []);

    // await checkAndInsert(SugestaoForum, []);

    console.log("Data initialization complete.");
  } catch (error) {
    console.error("Error initializing data:", error);
  }
}

module.exports = initializeData;
