


// Isto vai servir para apagar conta e mostrar os modais respetivos
function handleSugestTopic() {
    console.log("A sugerir topico...");
    // Aqui você faria a chamada para sua função real de sugerir 

    // Após o topico ser sugerido com sucesso, mostre o modal de sucesso
    const editModalEl = document.getElementById('editModal');
    const editModal = bootstrap.Modal.getInstance(editModalEl);
    if (editModal) {
        editModal.hide();
    }

    const sugestSucessModalEl = document.getElementById('sugestSuccessModal');
    const sugestSucessModal = new bootstrap.Modal(sugestSucessModalEl);
    sugestSucessModal.show();
}

function closeSuccessModal() {
    const sugestSucessModalEl = document.getElementById('sugestSuccessModal');
    const sugestSucessModal = bootstrap.Modal.getInstance(sugestSucessModalEl);
    if (sugestSucessModal) {
        sugestSucessModal.hide();
    }
}

// Isto vai servir para apagar conta e mostrar os modais respetivos
function handleEditProfile() {
    console.log("A editar informações de perfil...");
    // Aqui você faria a chamada para sua função real de editar perfil 

    // Após o perfil ser editado com sucesso, mostrar o modal de sucesso
    const editProfileModalEl = document.getElementById('editProfileModal');
    const editProfileModal = bootstrap.Modal.getInstance(editProfileModalEl);
    if (editProfileModal) {
        editProfileModal.hide();
    }

    const editProfileSucessModalEl = document.getElementById('editProfileSuccessModal');
    const editProfileSucessModal = new bootstrap.Modal(editProfileSucessModalEl);
    editProfileSucessModal.show();
}

function closeEditProfileSuccessModal() {
    const editProfileSucessModalEl = document.getElementById('editProfileSuccessModal');
    const editProfileSucessModal = bootstrap.Modal.getInstance(editProfileSucessModalEl);
    if (editProfileSucessModal) {
        editProfileSucessModal.hide();
    }
}

