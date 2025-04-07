
// Isto é para o menu da sidebar, vai ativar na página em que estamos
document.addEventListener("DOMContentLoaded", function() {
    // Obtém o caminho da URL atual
    let path = window.location.pathname;
    let page = path.split("/").pop();

    // Seleciona o item do Dashboard
    let dashboardItem = document.querySelector(".dashboard-container ul li");
    let dashboardLink = dashboardItem ? dashboardItem.querySelector("a") : null;

    if (dashboardLink) {
        let href = dashboardLink.getAttribute("href");
        if (href === page) {
            dashboardItem.classList.add("active");
        } else {
            dashboardItem.classList.remove("active");
        }
    }

    // Seleciona os outros itens do menu 
    let menuItems = document.querySelectorAll(".menu-container > ul > li");

    menuItems.forEach(item => {
        let link = item.querySelector("a");
        if (link) {
            let href = link.getAttribute("href");
            if (href === page) {
                item.classList.add("active");
            } else {
                item.classList.remove("active");
            }
        }
    });
});

// Mostrar palavra-passe
function togglePassword(id) {
    var input = document.getElementById(id);
    var eyeIcon = input.nextElementSibling.querySelector('i'); 

    if (input.type === "password") {
        input.type = "text";
        if (eyeIcon) {
            eyeIcon.classList.remove('fa-eye-slash');
            eyeIcon.classList.add('fa-eye');
        }
    } else {
        input.type = "password";
        if (eyeIcon) {
            eyeIcon.classList.remove('fa-eye');
            eyeIcon.classList.add('fa-eye-slash');
        }
    }
}

// Vai servir para dar upload a imagem em Gerir_cursos no adicionar utilizador
document.addEventListener('DOMContentLoaded', function() {
    const profileImage = document.getElementById('profileImage');
    const imageUpload = document.getElementById('imageUpload');

    profileImage.addEventListener('click', function() {
        imageUpload.click();
    });

    imageUpload.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                profileImage.src = e.target.result;
                // Aqui você pode armazenar o 'file' para posterior envio
            }
            reader.readAsDataURL(file);
        }
    });
});

// para botão do adicioanr curso
document.addEventListener('DOMContentLoaded', function() {
    const botaoAdicionarCurso = document.getElementById('btnAdicionarCurso');

    if (botaoAdicionarCurso) {
        botaoAdicionarCurso.addEventListener('click', function() {
            window.location.href = 'criar_curso.html';
        });
    } else {
        console.error('Botão "Adicionar Curso" não encontrado!');
    }
});

// para botão do adicioanr topico
document.addEventListener('DOMContentLoaded', function() {
    const botaoAdicionarTopico = document.getElementById('btnAdicionarTopico');

    if (botaoAdicionarTopico) {
        botaoAdicionarTopico.addEventListener('click', function() {
            window.location.href = 'criar_topico.html';
        });
    } else {
        console.error('Botão "Adicionar Topico" não encontrado!');
    }
});



// Mostrar o modal de editar utilizador
const editModal = document.getElementById('editModal');
editModal.addEventListener('show.bs.modal', event => {
    // Botão que disparou o modal
    const button = event.relatedTarget;
    // Extrai informações dos atributos data-*
    const nome = button.dataset.nome;
    const tipo = button.dataset.tipo;

    // Atualiza o conteúdo do modal
    const modalTitle = editModal.querySelector('#editModalLabel');
    const nomeInput = editModal.querySelector('input[type="value"]'); // Ajuste o seletor se necessário
    const tipoSelect = editModal.querySelector('.form-select'); // Ajuste o seletor se necessário

    modalTitle.textContent = `Editar dados`;
    nomeInput.value = nome;

    // Seleciona a opção correta no select (opcional, se você quer editar o tipo)
    for (let i = 0; i < tipoSelect.options.length; i++) {
        if (tipoSelect.options[i].value === tipo || tipoSelect.options[i].textContent === tipo) {
            tipoSelect.selectedIndex = i;
            break;
        }
    }

    
});


// Isto vai servir para apagar conta e mostrar os modais respetivos
function handleDeleteAccount() {
    console.log("Apagando a conta...");
    // Aqui você faria a chamada para sua função real de apagar a conta no backend

    // Após a conta ser apagada com sucesso, mostre o modal de sucesso
    const deleteAccountModalEl = document.getElementById('deleteAccountModal');
    const deleteAccountModal = bootstrap.Modal.getInstance(deleteAccountModalEl);
    if (deleteAccountModal) {
        deleteAccountModal.hide();
    }

    const deleteAccountSuccessModalEl = document.getElementById('deleteAccountSuccessModal');
    const deleteAccountSuccessModal = new bootstrap.Modal(deleteAccountSuccessModalEl);
    deleteAccountSuccessModal.show();
}

function handleDeleteDenuncia() {
    console.log("Apagando a denúncia...");
    // Aqui você faria a chamada real ao backend para apagar a denúncia

    // Fecha o modal de confirmação
    const deleteDenunciaModalEl = document.getElementById('deleteAccountModal');
    const deleteDenunciaModal = bootstrap.Modal.getInstance(deleteDenunciaModalEl);
    if (deleteDenunciaModal) {
        deleteDenunciaModal.hide();
    }

    // Mostra o modal de sucesso
    const deleteSuccessModalEl = document.getElementById('deleteDenunciaSuccessModal');
    const deleteSuccessModal = new bootstrap.Modal(deleteSuccessModalEl);
    deleteSuccessModal.show();
}

function closeSuccessModalAccount() {
    const deleteAccountSuccessModalEl = document.getElementById('deleteAccountSuccessModal');
    const deleteAccountSuccessModal = bootstrap.Modal.getInstance(deleteAccountSuccessModalEl);
    if (deleteAccountSuccessModal) {
        deleteAccountSuccessModal.hide();
        // Opcional: Redirecionar o usuário ou realizar outra ação após o sucesso
        // window.location.href = "/pagina-inicial";
    }
}

function closeSuccessModalDenuncia() {
    const deleteSuccessModalEl = document.getElementById('deleteDenunciaSuccessModal');
    const deleteSuccessModal = bootstrap.Modal.getInstance(deleteSuccessModalEl);
    if (deleteSuccessModal) {
        deleteSuccessModal.hide();
        // Opcional: redirecionar ou atualizar a tabela
        // location.reload(); ou window.location.href = "/denuncias";
    }
}