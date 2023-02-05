const btn = document.getElementsByClassName("btn");
const slide = document.getElementById("slide");
btn[0].onclick = function () {
  slide.style.transform = "translatex(0px)";
  for (i = 0; i < 3; i++) {
    btn[i].classList.remove("active");
  }
  this.classList.add("active");
};
btn[1].onclick = function () {
  slide.style.transform = "translatex(-800px)";
  for (i = 0; i < 3; i++) {
    btn[i].classList.remove("active");
  }
  this.classList.add("active");
};
btn[2].onclick = function () {
  slide.style.transform = "translatex(-1600px)";
  for (i = 0; i < 3; i++) {
    btn[i].classList.remove("active");
  }
  this.classList.add("active");
};
