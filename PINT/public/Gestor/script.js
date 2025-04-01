document.addEventListener("DOMContentLoaded", function() {
    // Obtém o caminho da URL atual
    let path = window.location.pathname;
    let page = path.split("/").pop(); // Obtém o nome do arquivo (ex: "index.html")

    // Seleciona todos os itens do menu
    let menuItems = document.querySelectorAll(".menu-container ul li");

    menuItems.forEach(item => {
        let link = item.querySelector("a");
        if (link) {
            let href = link.getAttribute("href");
            
            // Se o href do link corresponde à página atual, adiciona a classe "active"
            if (href === page) {
                item.classList.add("active");
            } else {
                item.classList.remove("active");
            }
        }
    });
});