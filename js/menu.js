const hamburger = document.getElementById("hamburger")
const cancel = document.getElementById("cancel")
const banner = document.getElementById("banner")
const extended_menu = document.getElementById("extended-menu")
hamburger.addEventListener("click", () => {
    hamburger.style.display = "none";
    cancel.style.display = "block";
    extended_menu.style.display="block";
    extended_menu.classList.add("active");
})
cancel.addEventListener("click", () => {
    hamburger.style.display = "block";
    cancel.style.display = "none";
    extended_menu.classList.remove("active");
    extended_menu.style.display = "none";
})