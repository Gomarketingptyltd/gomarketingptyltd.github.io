const down = document.getElementById("drop-down");
const up = document.getElementById("drop-up");
const services = document.getElementById("menu-services");
if (down && up && services) {
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
}

function optimizeImages() {
    const images = document.querySelectorAll("img");

    images.forEach((img) => {
        if (!img.hasAttribute("decoding")) {
            img.decoding = "async";
        }

        const isCriticalImage = Boolean(
            img.closest(".header") ||
            img.closest("#banner") ||
            img.closest(".banner") ||
            img.closest(".graphic__head") ||
            img.closest(".image-wrapper") ||
            img.closest(".my-blog")
        );

        if (!img.hasAttribute("loading")) {
            img.loading = isCriticalImage ? "eager" : "lazy";
        }

        if (isCriticalImage && !img.hasAttribute("fetchpriority")) {
            img.fetchPriority = "high";
        }
    });
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", optimizeImages, { once: true });
} else {
    optimizeImages();
}
