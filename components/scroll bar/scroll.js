const container = document.querySelector('.testimonial__container');
const testimonials = document.querySelectorAll('.testimonial__text');
const prevButton = document.querySelector('.testimonial__prev');
const nextButton = document.querySelector('.testimonial__next');
let currentSlide = 0;

const updateSlider = () => {
  if (window.innerWidth <= 1453) {
    testimonials.forEach((testimonial__text, index) => {
      if (index === currentSlide) {
        testimonial__text.style.display = 'block';
      } else {
        testimonial__text.style.display = 'none';
      }
    });
  } else {
    testimonials.forEach(testimonial__text => {
      testimonial__text.style.display = 'flex';
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
