document.addEventListener('DOMContentLoaded', function() {
    // Slider functionality
    const slider = document.querySelector('.slider-container');
    const slides = document.querySelectorAll('.slider-image');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    let currentIndex = 0;
  
    function showSlide(index) {
      slider.style.transform = `translateX(-${index * 100}%)`;
    }
  
    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      showSlide(currentIndex);
    });
  
    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % slides.length;
      showSlide(currentIndex);
    });
  
    // Auto-advance slides
    setInterval(() => {
      currentIndex = (currentIndex + 1) % slides.length;
      showSlide(currentIndex);
    }, 5000);
  
    // Add to cart functionality
    const addToCartForms = document.querySelectorAll('form[action="/cart/add"]');
    addToCartForms.forEach(form => {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        try {
          const response = await fetch('/cart/add', {
            method: 'POST',
            body: formData,
            headers: {
              'CSRF-Token': form.querySelector('[name="_csrf"]').value
            }
          });
          const result = await response.json();
          if (result.message) {
            alert(result.message);
          }
        } catch (error) {
          console.error('Error:', error);
        }
      });
    });
  });