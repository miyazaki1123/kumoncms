const MQ = window.matchMedia("(min-width: 769px)");
import { sideNav } from "./sideNav.js";
import { passwordVisibility } from "./passwordVisibility.js";
import { slideToggle } from "./slideToggle.js";

const mainListener = function(event) {
    document.location.reload();
};

MQ.addEventListener('change', mainListener);
const setFillHeight = function() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }



document.addEventListener("DOMContentLoaded", function() {
    if(document.querySelector('.sec--account')){
      passwordVisibility();
    }
    if(document.getElementById('page')){
      sideNav();
      let slideTarget = document.querySelector('.genre1');
      let slideButton = document.querySelector('.toggle-genre1');
      slideButton.addEventListener('click',function(){
        slideToggle(slideTarget,slideButton,600);
      });
      
    }
});
window.addEventListener('resize', function() {
    
});

