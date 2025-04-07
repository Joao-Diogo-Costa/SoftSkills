


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