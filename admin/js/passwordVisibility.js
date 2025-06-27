export function passwordVisibility() {
  const dataFrom = document.querySelector('.date-from');
  if(dataFrom){
    dataFrom.addEventListener('change', function() {
      //console.log(dataFrom.value);
    })
  }
    document.querySelectorAll('.icon-visibility').forEach(function(elem){
        elem.addEventListener('click',function(){
          
          const input = elem.nextElementSibling;
          if (input.type === "password") {
            input.type = "text";
            elem.classList.add('icon-visibility-off');
          } else {
              input.type = "password";
              elem.classList.remove('icon-visibility-off');
          }
        });
      });
};