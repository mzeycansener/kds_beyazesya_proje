document.addEventListener('DOMContentLoaded', () => {
    window.addEventListener('click', function (event) {
        const productModal = document.getElementById('productDetailModal');
        if (event.target === productModal) {
            closeModal();
        }
    });
});