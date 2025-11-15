// FORMULAIRE NETLIFY - Confirmation utilisateur
const form = document.querySelector('form[name="contact"]');

if (form) {
    form.addEventListener("submit", function (event) {
        // Netlify prend la main après l’envoi
        setTimeout(() => {
            alert("Message envoyé ! Nous vous répondrons sous 24h.");
        }, 150);
    });
}



// AJOUT OPTIONNEL (smooth scroll + animation légère)
// -------------------------------------------------

// Smooth Scroll pour les ancres du menu
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    });
});

// Effet fade-in au scroll
const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
            }
        });
    },
    { threshold: 0.15 }
);

// Appliquer l’effet aux cartes / sections
document.querySelectorAll(".service-card, .why-item, .contact-form, .info-item").forEach(el => {
    el.classList.add("hidden-section");
    observer.observe(el);
});
