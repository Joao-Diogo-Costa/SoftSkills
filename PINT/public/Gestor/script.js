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

function closeSuccessModal() {
    const deleteAccountSuccessModalEl = document.getElementById('deleteAccountSuccessModal');
    const deleteAccountSuccessModal = bootstrap.Modal.getInstance(deleteAccountSuccessModalEl);
    if (deleteAccountSuccessModal) {
        deleteAccountSuccessModal.hide();
        // Opcional: Redirecionar o usuário ou realizar outra ação após o sucesso
        // window.location.href = "/pagina-inicial";
    }
}