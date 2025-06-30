const MQ = window.matchMedia("(min-width: 769px)");
import { sideNav } from "./sideNav.js";
import { passwordVisibility } from "./passwordVisibility.js";
import { slideToggle, slideUp, slideDown } from "./slideToggle.js";

const mainListener = function (event) {
  document.location.reload();
};

MQ.addEventListener("change", mainListener);
const setFillHeight = function () {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
};

document.addEventListener("DOMContentLoaded", function () {
  if (document.querySelector('[name="blog_id"]')) {
    document.querySelectorAll('[name="blog_id"]').forEach(function (e, index) {
      e.addEventListener("change", function () {

          document.querySelectorAll('[name="blog_id"]').forEach(function (e2) {
            const li2 = e2.closest("li");
            if (li2.querySelector("ul")) {
              if (li2.querySelector("ul").style.display == "block") {
                const slideTarget2 = li2.querySelector("ul");
                const slideButton2 = e2;
                slideUp(slideTarget2, slideButton2, 200);
              }
            }
          });

        const li = e.closest("li");
        const slideTarget = li.querySelector("ul");
        if (slideTarget) {
          const slideButton = e;
          console.log(slideButton);
          slideDown(slideTarget, slideButton, 200);
        
        }
      });
    });
  }

  if (document.querySelector(".sec--account")) {
    passwordVisibility();
  }
  if (document.getElementById("page")) {
    sideNav();
    const slideButton = document.querySelector(".toggle-genre1");
    const slideMenu = document.querySelector(".btn-menu");
    slideButton.addEventListener("click", function () {
      slideButton.classList.toggle('close');
      document.querySelector('.site-contents').classList.toggle('hide-right');
      document.querySelector('.right').classList.toggle('hide');
    });

    slideMenu.addEventListener("click", function () {
      slideMenu.classList.toggle('close');
      document.querySelector('.site-main').classList.toggle('hide-navi');
      document.getElementById('navi').classList.toggle('hide');
    });

  }
});
window.addEventListener("resize", function () {});
