const container = document.querySelector('.container');
const testimonials = document.querySelectorAll('.testimonial');
const prevButton = document.querySelector('.prev');
const nextButton = document.querySelector('.next');
let currentSlide = 0;

const updateSlider = () => {
  if (window.innerWidth <= 1453) {
    testimonials.forEach((testimonial, index) => {
      if (index === currentSlide) {
        testimonial.style.display = 'block';
      } else {
        testimonial.style.display = 'none';
      }
    });
  } else {
    testimonials.forEach(testimonial => {
      testimonial.style.display = 'flex';
    });
  }
};

updateSlider();

prevButton.addEventListener('click', () => {
  if (window.innerWidth <= 1453) {
    currentSlide--;
    if (currentSlide < 0) {
      currentSlide = testimonials.length - 1;
    }
  }
  updateSlider();
});

nextButton.addEventListener('click', () => {
  if (window.innerWidth <= 1453) {
    currentSlide++;
    if (currentSlide === testimonials.length) {
      currentSlide = 0;
    }
  }
  updateSlider();
});
