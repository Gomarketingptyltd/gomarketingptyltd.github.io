const hamburger = document.getElementById("hamburger")
const cancel = document.getElementById("cancel")
const banner = document.getElementById("banner")
const extended_menu = document.getElementById("extended-menu")
if (hamburger && cancel && extended_menu) {
    const closeMenu = () => {
        hamburger.style.display = "block";
        cancel.style.display = "none";
        extended_menu.classList.remove("active");
        extended_menu.style.display = "none";
        document.body.classList.remove("menu-open");
    }
    hamburger.addEventListener("click", () => {
        hamburger.style.display = "none";
        cancel.style.display = "block";
        extended_menu.style.display="block";
        extended_menu.classList.add("active");
        document.body.classList.add("menu-open");
    })
    cancel.addEventListener("click", () => {
        closeMenu();
    })
    extended_menu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeMenu);
    })
}
