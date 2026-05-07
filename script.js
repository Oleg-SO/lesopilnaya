document.addEventListener('DOMContentLoaded', function() {
    
    // Анимация при скролле (Intersection Observer)
    const animateElements = document.querySelectorAll('.advantage-item, .product-card, .stat');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-up');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    animateElements.forEach(el => observer.observe(el));
    
    // Обработка форм
    const mainForm = document.getElementById('contactForm');
    const modalForm = document.getElementById('modalContactForm');
    const formMessage = document.getElementById('formMessage');
    
    function sendToTelegram(data) {
        // Здесь настройте отправку в ваш Telegram бот
        console.log('Заявка:', data);
        return true;
    }
    
    function handleSubmit(event, form) {
        event.preventDefault();
        
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            phone: formData.get('phone'),
            message: formData.get('message') || formData.get('product') || 'Не указано'
        };
        
        if (sendToTelegram(data)) {
            if (formMessage) {
                formMessage.innerHTML = '✅ Спасибо! Мы перезвоним в течение 15 минут.';
                formMessage.style.color = '#c9a04c';
                form.reset();
                setTimeout(() => {
                    formMessage.innerHTML = '';
                }, 5000);
            } else {
                alert('Спасибо! Мы перезвоним в течение 15 минут.');
                form.reset();
                closeModal();
            }
        }
    }
    
    if (mainForm) mainForm.addEventListener('submit', (e) => handleSubmit(e, mainForm));
    if (modalForm) modalForm.addEventListener('submit', (e) => handleSubmit(e, modalForm));
    
    // Модальное окно
    const modal = document.getElementById('modalForm');
    const openBtns = document.querySelectorAll('#openFormBtn, #heroFormBtn');
    const closeBtn = document.querySelector('.close');
    const productModalInput = document.getElementById('modalProduct');
    
    // Кнопки заказа товара
    const productBtns = document.querySelectorAll('.product-btn');
    productBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const productName = btn.getAttribute('data-product');
            if (productModalInput) productModalInput.value = productName;
            modal.style.display = 'flex';
        });
    });
    
    openBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (productModalInput) productModalInput.value = '';
            modal.style.display = 'flex';
        });
    });
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Яндекс Карта
    ymaps.ready(initMap);
    
    function initMap() {
        const map = new ymaps.Map('map', {
            center: [55.1644, 61.4368], // Челябинск
            zoom: 11,
            controls: ['zoomControl', 'fullscreenControl']
        });
        
        const placemark = new ymaps.Placemark([55.1644, 61.4368], {
            balloonContent: 'ООО "ЮУЛК" - база в Челябинске<br>Точный адрес при заказе'
        }, {
            preset: 'islands#greenBusinessIcon',
            iconColor: '#1a3a2a'
        });
        
        map.geoObjects.add(placemark);
    }
    
    // Плавная прокрутка
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});