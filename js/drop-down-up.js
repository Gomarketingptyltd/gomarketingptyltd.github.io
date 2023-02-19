const down = document.getElementById("drop-down");
const up = document.getElementById("drop-up");
const services = document.getElementById("menu-services");
down.addEventListener("click", () => {
    down.style.display = "none";
    up.style.display = "block";
    services.style.display = "flex";
})
up.addEventListener("click", () => {
    down.style.display = "block";
    up.style.display = "none";
    services.style.display = "none";
})