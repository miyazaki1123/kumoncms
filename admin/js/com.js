$(function () {
    $("img").mousedown(function(){
        return false;
    });
});

function image_click(image) {
    document.form1.image.value = image;
    document.form1.target="_blank";
    document.form1.submit();
}
