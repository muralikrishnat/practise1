$(document).ready(function () {
    $('.box').click(function () {
        $('.box').css({ width: '47%', height: '20px'});
        $(this).animate({'width': '99%', height: '300px'});
    });
});