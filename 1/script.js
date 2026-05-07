// Обработка форм обратной связи
document.addEventListener('DOMContentLoaded', function() {
    
    // Основная форма
    const mainForm = document.getElementById('contactForm');
    const modalForm = document.getElementById('modalContactForm');
    const formMessage = document.getElementById('formMessage');
    
    function handleSubmit(event, form) {
        event.preventDefault();
        
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            phone: formData.get('phone'),
            message: formData.get('message') || 'Не указано'
        };
        
        // Здесь можно настроить отправку на ваш Telegram бот или email
        console.log('Заявка:', data);
        
        // Показываем сообщение об успехе
        if (formMessage) {
            formMessage.innerHTML = '✅ Спасибо! Мы перезвоним в течение 15 минут.';
            formMessage.style.color = '#1e3a2f';
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
    
    if (mainForm) {
        mainForm.addEventListener('submit', (e) => handleSubmit(e, mainForm));
    }
    if (modalForm) {
        modalForm.addEventListener('submit', (e) => handleSubmit(e, modalForm));
    }
    
    // Модальное окно
    const modal = document.getElementById('modalForm');
    const openBtns = document.querySelectorAll('#openFormBtn, #heroFormBtn');
    const closeBtn = document.querySelector('.close');
    
    openBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modal.style.display = 'block';
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
            center: [55.917, 37.736], // Мытищи, Московская область
            zoom: 12,
            controls: ['zoomControl', 'fullscreenControl']
        });
        
        const placemark = new ymaps.Placemark([55.917, 37.736], {
            balloonContent: 'Наш склад: Московская обл., г. Мытищи, ул. Лесная, д. 15'
        }, {
            preset: 'islands#iconIcon',
            iconColor: '#d4a373'
        });
        
        map.geoObjects.add(placemark);
    }
});

// Плавная прокрутка к якорям
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});