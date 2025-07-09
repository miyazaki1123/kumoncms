const m_modal = '.m-modal';

let modalElement;
let mmstartX = 0;
let mmstartY = 0;
const urlParams = new URLSearchParams(window.location.search);
const someParam = urlParams.get('md');


function MMsetSize(){
  if(document.querySelectorAll('.noscroll')[0]){
    let targetElement = document.querySelectorAll('.modal__content');
    targetElement.forEach(function(element){
      if(element.clientHeight + 60 > window.innerHeight){
        //console.log(element.clientHeight + ' ' + window.innerHeight)
        //console.log('over')
        element.parentElement.classList.add('active');
       }else{
        element.parentElement.classList.remove('active');
       }
    });
    
  }
}
window.addEventListener('resize', function() {
  MMsetSize();
});
function openModal(elem,message){
//console.log(element.dataset.mTarget);
  const modal = elem.mTarget
  let delete_num;
  if(document.querySelectorAll('[data-m="'+modal+'"]')[0]){
    modalElement = document.querySelectorAll('[data-m="'+modal+'"]')[0];
  }else{
    alert('ターゲットのモーダルが見つかりません');
    return;
  }
	 if(modalElement.querySelector(m_modal + '-main__text')){
  let txt = modalElement.querySelector(m_modal + '-main__text');
 
    if(message){
      modalElement.querySelector(m_modal + '-main__text').innerHTML ='';
      modalElement.querySelector(m_modal + '-main__text').insertAdjacentHTML('beforeend', message);
     }
  }
  document.querySelectorAll(m_modal).forEach(function(e,index){
    if(e.classList.contains('active')){
      delete_num = index;
      e.classList.remove('active');
    }
    //e.classList.remove('active');
  })
  modalElement.classList.add('active');
  
  document.querySelector('body').classList.add('noscroll');
  if(elem.mSrc){
    if(fileType(elem.mSrc) == 'pdf'){
      DOMPdf(elem.mSrc);
    }else{
      DOMImg(elem.mSrc);
    }
    
  }else{
    //modalElement.querySelectorAll('.modal__content')[0].classList.add('activre');
  }
  MMsetSize();
}
function openMModal(target,message='',tag = 'strong',css=''){
  if(document.querySelector('[data-m="'+target+'"]')){
    modalElement = document.querySelector('[data-m="'+target+'"]');
  }else{
    alert('ターゲットのモーダルが見つかりません');
    return;
  }
      let txt = modalElement.querySelector(m_modal + '-main__text');
      if(txt){
        if(message){
         modalElement.querySelector(m_modal + '-main__text').innerHTML ='';
         modalElement.querySelector(m_modal + '-main__text').insertAdjacentHTML('beforeend', '<'+tag+' class="'+css+'">'+message+'</'+tag+'>');
        }
      }
     let delete_num;
     document.querySelectorAll(m_modal).forEach(function(e,index){
       if(e.classList.contains('active')){
         delete_num = index;
         e.classList.remove('active');
       }
     })
     modalElement.classList.add('active');
     document.querySelector('body').classList.add('noscroll');
     MMsetSize();
}
function closeMModal(target){
  if(!modalElement || !modalElement.classList.contains('active')){
    alert('ターゲットのモータルは開いていません');
    return;
  }
  if(modalElement == document.querySelector('[data-m="'+target+'"]')){
      modalElement = document.querySelector('[data-m="'+target+'"]');
  }else{
    alert('ターゲットのモーダルが見つかりません');
    return;
  }
  document.querySelector('body').classList.remove('noscroll');
  modalElement.classList.remove('active');
  modalElement.querySelectorAll(m_modal+'__content')[0].classList.remove('active');
}
function closeMMoadl(target){
  if(!document.querySelector('[data-m="'+target+'"]')){
    modalElement = document.getElementById(target);
  }else{
    alert('ターゲットのモーダルが見つかりません');
    return;
  }
  document.querySelector('body').classList.remove('noscroll');
  modalElement.classList.remove('active');
  modalElement.querySelectorAll(m_modal+'__content')[0].classList.remove('active');
}
document.addEventListener("click", function (event) {
  // `[data-m-target]` を持つ要素がクリックされたかチェック
  const target = event.target.closest("[data-m-target]");
  //console.log(target.dataset.mText)
 
  if (target) {
    //console.log(target.dataset.mTarget)
    if(target.dataset.mTarget == 'deleta-cardata'){
      const headElem = target.closest('.cont--car-data__head');
      //console.log(headElem.querySelector('[name="car-num"]').value)
      document.querySelector('.delete-car-num').value = headElem.querySelector('[name="car-num"]').value;
    }
    let message = '';
    if(target.dataset.mText){
      message = target.dataset.mText;
    }
    
      openModal(target.dataset,message);
  }
});
function fileType(src){
let srcArray = src.split('.');
//console.log(srcArray[srcArray.length - 1])
return srcArray[srcArray.length - 1];

}


function DOMImg(src){
  if(document.getElementById('modal-img')){
    document.getElementById('modal-img').remove();
  }
  let targetElement = modalElement.querySelectorAll(m_modal+'-main')[0];
  const newElement = document.createElement('div');
  newElement.id = 'modal-img';
  const newImage = document.createElement('img');
  newImage.src = src; // 画像のパスを設定
  newElement.appendChild(newImage);
  targetElement.appendChild(newElement);
  newImage.addEventListener('load', function() {
    MMsetSize();
    modalElement.querySelectorAll(m_modal+'__content')[0].classList.add('active');
  });
}
function DOMPdf(src){
  if(document.getElementById('modal-img')){
    document.getElementById('modal-img').remove();
  }
  let targetElement = modalElement.querySelectorAll(m_modal+'-main')[0];
  modalElement.querySelectorAll(m_modal+'__content')[0].classList.add('pdf');
  const newElement = document.createElement('div');
  newElement.id = 'modal-img';
  const newImage = document.createElement('iframe');
  newImage.src = src; // 画像のパスを設定
  newElement.appendChild(newImage);
  targetElement.appendChild(newElement);
  newImage.addEventListener('load', function() {
    MMsetSize();
    modalElement.querySelectorAll(m_modal+'__content')[0].classList.add('active');
  });
}
if (sessionStorage.getItem('m-session')) {
  const modalKey = sessionStorage.getItem('m-session');
  const targetModal = document.querySelector('[data-m="'+modalKey+'"]');

  if (targetModal) {
    openModal({ mTarget: modalKey });
    sessionStorage.removeItem('m-session'); // モーダル出したら削除
  }
}


window.addEventListener('DOMContentLoaded', function() {
  if(someParam){
    //console.log(document.querySelectorAll('[data-m-target="'+someParam+'"]')[0].dataset)
    let height = document.querySelector('.site-header').clientHeight + document.querySelector('.global-nav').clientHeight+30;
    let mediaHeight;
    mediaHeight = -height;
    
    const targetElement = document.getElementById('self-check').getBoundingClientRect().top + window.pageYOffset + mediaHeight;
    //console.log(window.pageYOffset)
    setTimeout(function () {
      window.scrollTo({
        top: targetElement,
        behavior: "smooth"
      });
    }, 300);
  
    openModal(document.querySelectorAll('[data-m-target="'+someParam+'"]')[0].dataset);
  }
  document.querySelectorAll('.modal-main__tabs').forEach(function(tab){
    tab.addEventListener('click', function() {
      MMsetSize();
    });
  });
  if(document.querySelector('[data-m]')){
    document.querySelectorAll(m_modal).forEach(function(e,index){
      e.querySelectorAll('.close-modal').forEach(function(btn) {
        btn.addEventListener('click', function(element) {
        document.querySelector('body').classList.remove('noscroll');
        modalElement.classList.remove('active');
        modalElement.querySelectorAll(m_modal+'__content')[0].classList.remove('active');
        modalElement.querySelectorAll(m_modal+'__content')[0].classList.remove('pdf');
      });
    });
      e.addEventListener('click', function(element) {
        //console.log(element.target)
        if(element.target.closest(m_modal+'__content') === null) {
          document.querySelector('body').classList.remove('noscroll');
          this.classList.remove('active');
          //modalElement.querySelectorAll('.modal__content')[0].classList.remove('active');
          //modalElement.querySelectorAll('.modal__content')[0].classList.remove('pdf');
        }
      });
      
    });
    
  }
  document.querySelectorAll('.btn-cancel').forEach(el => {
    const btnHtml = document.createElement('button');
    btnHtml.type = "button";
    btnHtml.className = "close-modal btn-cancel";
    btnHtml.setAttribute('data-bs-dismiss', 'modal');
    
    el.closest('.modal-content').appendChild(btnHtml);
  });
  
  document.querySelectorAll('[data-m-session]').forEach(el => {
    el.addEventListener('click', function() {
      const sessionKey = el.dataset.mSession;
      sessionStorage.setItem('m-session', sessionKey);
      //location.reload(); // or location.href = location.href;
    });
  });
});