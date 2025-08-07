document.addEventListener("DOMContentLoaded", function() {
    // Update the footer with the current year
    document.getElementById("currentYear").textContent = new Date().getFullYear();
});

// Function to toggle the navigation menu on small screens. add some animation
// This function is called when the navbar toggler button is clicked.
function toggleMenu() {
    const navMenu = document.getElementById("navbarNav");
    navMenu.classList.toggle("show");
    navMenu.classList.toggle("animate");
}

// Function to scroll to a section smoothly
function scrollToSection(event) {
    event.preventDefault();
    const targetId = event.currentTarget.getAttribute("href");
    const targetElement = document.querySelector(targetId);
    targetElement.scrollIntoView({ behavior: "smooth" });
}

function addAnimation() {
    const navMenu = document.getElementById("navbarNav");
    navMenu.classList.add("animate");
}