const MQ = window.matchMedia("(min-width: 769px)");
import { sideNav } from "./sideNav.js";
import { passwordVisibility } from "./passwordVisibility.js";
import { slideToggle, slideUp, slideDown } from "./slideToggle.js";
import "./modal.js";
const mainListener = function (event) {
  document.location.reload();
};

MQ.addEventListener("change", mainListener);
const setFillHeight = function () {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
};

document.addEventListener("DOMContentLoaded", function () {
    document.querySelector('.site-contents').style.minHeight = document.getElementById('navi').clientHeight + 'px';

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

const tbl_01 = document.querySelectorAll('.tbl--s01')
if(tbl_01){
   tbl_01.forEach(table => {
  // theadのthをすべて取得
  const ths = table.querySelectorAll('thead th');
  ths.forEach((th, index) => {
    if (th.classList.contains('align--center')) {
      // tbody内の全trに対して同じ列のtdにクラスを付与
      table.querySelectorAll('tbody tr').forEach(tr => {
        const tds = tr.querySelectorAll('td');
        if (tds[index]) {
          tds[index].classList.add('align--center');
        }
      });
    }
  });
});
}


const tblScroll = document.querySelector('.tbl-scroll');
if (tblScroll) {
  const tr = tblScroll.querySelectorAll('table tbody tr')[0];
  const num = tr.querySelectorAll('td').length;

  // data属性の取得（存在しない場合は150にする）
  const thWidth = tblScroll.dataset.scrollThWidth ? parseInt(tblScroll.dataset.scrollThWidth, 10) : 150;

  // 幅を計算して設定
  tblScroll.querySelector('table').style.minWidth = (num * thWidth) + 'px';
}
    sideNav();
    const slideButton = document.querySelector(".toggle-genre1");
    const slideMenu = document.querySelector(".btn-menu");
      if(document.querySelector('.right')){
    slideButton.addEventListener("click", function () {
      slideButton.classList.toggle('close');
      document.querySelector('.site-contents').classList.toggle('hide-right');
      document.querySelector('.right').classList.toggle('hide');
    });
  }
    slideMenu.addEventListener("click", function () {
      slideMenu.classList.toggle('close');
      document.querySelector('.site-main').classList.toggle('hide-navi');
      document.getElementById('navi').classList.toggle('hide');
    });

  }

  
});


document.addEventListener("DOMContentLoaded", function () {
  const dropzone = document.getElementById('dropzone');
  const fileInput = document.getElementById('image1');
  const form = document.getElementById('add');
  const previewArea = document.getElementById('preview-area');


  // 画像プレビュー表示
  function showPreview(file) {
    if (!file.type.match('image.*')) return;
    const reader = new FileReader();
    reader.onload = function (e) {
      dropzone.querySelector('div').classList.add('hide');
      previewArea.innerHTML = `<img src="${e.target.result}" display:block;">`;
    };
    reader.readAsDataURL(file);
  }

  // ファイルがセットされたときの共通処理
  function handleFiles(files) {
    if (files.length) {
      showPreview(files[0]); // 1枚のみ対応
      //fileInput.files = files; // ドロップ時はすでにセット済み
    }
  }
  if(dropzone){


  // ドラッグ時のスタイル変更
  dropzone.addEventListener('dragover', function (e) {
    e.preventDefault();
    dropzone.classList.add('dragover');
  });

  dropzone.addEventListener('dragleave', function (e) {
    e.preventDefault();
    dropzone.classList.remove('dragover');
  });

  // ドロップ時の処理
  dropzone.addEventListener('drop', function (e) {
    e.preventDefault();
    dropzone.classList.remove('dragover');
    const files = e.dataTransfer.files;
    if (files.length) {
      fileInput.files = files; // inputにセット
      handleFiles(files);
    }
  });

  // クリックでファイル選択
  dropzone.addEventListener('click', function () {
    fileInput.click();
  });

  // ファイル選択時のプレビュー
  fileInput.addEventListener('change', function (e) {
    handleFiles(fileInput.files);
  });
    }
});
window.addEventListener("load", function () {



});
window.addEventListener("resize", function () {});
