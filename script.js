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
    
    // Функция отправки на PHP
    async function sendToServer(formData) {
        try {
            const response = await fetch('sendmail.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams(formData)
            });
            
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Ошибка отправки:', error);
            return { success: false, message: 'Ошибка соединения' };
        }
    }
    
    // Обработчик отправки формы
    async function handleSubmit(event, form, isModal = false) {
        event.preventDefault();
        
        // Собираем данные
        const formData = new FormData(form);
        const message = formData.get('message') || formData.get('product') || 'Не указано';
        formData.set('message', message);
        
        // Показываем индикатор загрузки
        const submitBtn = form.querySelector('.submit-btn');
        const originalBtnText = submitBtn ? submitBtn.textContent : 'Отправить';
        if (submitBtn) {
            submitBtn.textContent = 'Отправка...';
            submitBtn.disabled = true;
        }
        
        // Отправляем на сервер
        const result = await sendToServer(formData);
        
        // Восстанавливаем кнопку
        if (submitBtn) {
            submitBtn.textContent = originalBtnText;
            submitBtn.disabled = false;
        }
        
        // Обрабатываем ответ
        if (result.success) {
            // Успех
            if (formMessage && !isModal) {
                formMessage.innerHTML = '✅ Спасибо! Мы свяжемся с вами в ближайшее время.';
                formMessage.style.color = '#2ecc71';
                form.reset();
                setTimeout(() => {
                    formMessage.innerHTML = '';
                }, 5000);
            } else {
                alert('✅ Спасибо! Мы свяжемся с вами.');
                form.reset();
                closeModal();
            }
        } else {
            // Ошибка
            const errorMsg = result.message || 'Ошибка отправки. Позвоните нам по телефону.';
            if (formMessage && !isModal) {
                formMessage.innerHTML = '❌ ' + errorMsg;
                formMessage.style.color = '#e74c3c';
                setTimeout(() => {
                    formMessage.innerHTML = '';
                }, 5000);
            } else {
                alert('❌ ' + errorMsg);
            }
        }
    }
    
    // Назначаем обработчики
    if (mainForm) {
        mainForm.addEventListener('submit', (e) => handleSubmit(e, mainForm, false));
    }
    if (modalForm) {
        modalForm.addEventListener('submit', (e) => handleSubmit(e, modalForm, true));
    }
    
    // Модальное окно
    const modal = document.getElementById('modalForm');
    const openBtns = document.querySelectorAll('#openFormBtn, #heroFormBtn');
    const closeBtn = document.querySelector('.close');
    const productModalInput = document.getElementById('modalProduct');
    
    // Функция закрытия модалки
    function closeModal() {
        if (modal) {
            modal.style.display = 'none';
        }
    }
    
    // Кнопки заказа товара
    const productBtns = document.querySelectorAll('.product-btn');
    productBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const productName = btn.getAttribute('data-product');
            if (productModalInput) {
                productModalInput.value = productName;
            }
            // Также заполним поле message в модальной форме
            const modalMessageField = modalForm ? modalForm.querySelector('textarea') : null;
            if (modalMessageField && productName) {
                modalMessageField.value = 'Товар: ' + productName;
            }
            if (modal) {
                modal.style.display = 'flex';
            }
        });
    });
    
    openBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (productModalInput) {
                productModalInput.value = '';
            }
            // Очищаем поле message в модальной форме
            const modalMessageField = modalForm ? modalForm.querySelector('textarea') : null;
            if (modalMessageField) {
                modalMessageField.value = '';
            }
            if (modal) {
                modal.style.display = 'flex';
            }
        });
    });
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Яндекс Карта (проверяем, что элемент существует)
    if (typeof ymaps !== 'undefined' && document.getElementById('map')) {
        ymaps.ready(initMap);
    }
    
    function initMap() {
        const mapElement = document.getElementById('map');
        if (!mapElement) return;
        
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
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});