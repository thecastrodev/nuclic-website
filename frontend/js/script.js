
document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const menuButton = document.querySelector('.menuButton-nav');
    const linksContainer = document.querySelector('.links-nav');
    
    if (menuButton && linksContainer) {
        menuButton.addEventListener('click', () => {
            linksContainer.classList.toggle('linksOpen-nav');
        });
    }
});
