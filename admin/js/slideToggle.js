/* ver 3.0.0 */
let SLIDE_TOGGLE_FLAG = 0;

export function slideToggle(element,btn,speed,overflow='hidden',youso='block') {
  let speed2;
  if(!speed){
    speed2 = '0.6s';
    speed = 600;
  }else{
    speed2 = (speed/1000)+'s';
  }
  if(SLIDE_TOGGLE_FLAG == 0){
    SLIDE_TOGGLE_FLAG = 1;
    //console.log(SLIDE_TOGGLE_FLAG)
    //clearTimeout(SLIDE_TIMEID2);
    if(window.getComputedStyle(element).display === 'none') {
      slide_expend_func(element,btn,speed2,speed,overflow,youso);
    } else {
      slide_collapse_func(element,btn,speed2,speed,overflow);
    }
  }

  
}
export function slideUp(element,btn,speed,overflow='hidden') {
  let speed2;
  if(!speed){
    speed2 = '0.6s';
    speed = 600;
  }else{
    speed2 = (speed/1000)+'s';
  }
  slide_collapse_func(element,btn,speed2,speed,overflow); 
}
export function slideDown(element,btn,speed,overflow='hidden',youso='block') {
  let speed2;
  if(!speed){
    speed2 = '0.6s';
    speed = 600;
  }else{
    speed2 = (speed/1000)+'s';
  }
  slide_expend_func(element,btn,speed2,speed,overflow,youso); 
}
function slide_expend_func(element,btn,speed2,speed,overflow,youso) {
  element.style.display = youso;
  let paddingTop;
  let paddingBottom;
  let marginTop;
  let marginBottom;
  paddingTop = element.getAttribute('data-padding-Top');
  paddingBottom = element.getAttribute('data-padding-Bottom');
  marginTop = element.getAttribute('data-margin-Top');
  marginBottom = element.getAttribute('data-margin-Bottom');
  let style = window.getComputedStyle(element);
  if(!paddingTop){
    paddingTop = style.getPropertyValue('padding-top');
    element.setAttribute('data-padding-Top', paddingTop);
  }
  if(!paddingBottom){
    paddingBottom = style.getPropertyValue('padding-bottom');
    element.setAttribute('data-padding-Bottom', paddingBottom);
  }
  if(!marginTop){
    marginTop = style.getPropertyValue('margin-top');
    element.setAttribute('data-margin-Top', marginTop);
  }
  if(!marginBottom){
    marginBottom = style.getPropertyValue('margin-bottom');
    element.setAttribute('data-margin-Bottom', marginBottom);
  }
  let height = element.scrollHeight;
  //console.log(height)
  element.style.paddingTop = '0';
  element.style.paddingBottom = '0';
  element.style.marginTop = '0';
  element.style.marginBottom = '0';
  element.style.height = '0';
  element.style.minHeight = '0';
  element.style.overflow = overflow;
  let SLIDE_TIMEID = setTimeout(function() {
    element.style.transition = 'all '+speed2;
    element.style.height = height + 'px';
    element.style.minHeight = height + 'px';
    element.style.paddingTop = paddingTop;
    element.style.paddingBottom = paddingBottom;
    element.style.marginTop = marginTop;
    element.style.marginBottom = marginBottom;
    element.classList.add('active');
    btn.classList.add('active');
  }, 0); // 1ms wait for rendering after changing display

  let SLIDE_TIMEID2 = setTimeout(function() {
    element.style.height = '';
    SLIDE_TOGGLE_FLAG = 0;
    //console.log(SLIDE_TOGGLE_FLAG)
  }, speed); // wait for transition; 300ms is default in jQuery
}

function slide_collapse_func(element,btn,speed2,speed,overflow) {
  let height = element.scrollHeight;
  element.style.height = height + 'px';
  let SLIDE_TIMEID = setTimeout(function() {
    element.style.transition = 'all '+speed2;
    element.style.height = '0';
    element.style.minHeight = '0';
    element.style.paddingTop = '0';
    element.style.paddingBottom = '0';
    element.style.marginTop = '0';
    element.style.marginBottom = '0';
    element.classList.remove('active');
    btn.classList.remove('active');
  }, 0); // 1ms wait for rendering after changing height
  element.style.overflow = 'hidden';
  let SLIDE_TIMEID2 = setTimeout(function() {
    //console.log(overflow)
    SLIDE_TOGGLE_FLAG = 0;
    //console.log(SLIDE_TOGGLE_FLAG)
    if(overflow == 1){
      element.style.overflow = 'auto';
   }
    element.style.display = 'none';
    element.style.height = '';
  }, speed); // wait for transition
  
}