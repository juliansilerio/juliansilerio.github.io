function checkNavbar(location) {
    console.log($(window).scrollTop());
    if ($(window).scrollTop() > location) {
        $('#nav_bar').show();
        $('#nav_bar').addClass('navbar-fixed');
    }
    if ($(window).scrollTop() < location) {
        $('#nav_bar').hide();
        $('#nav_bar').removeClass('navbar-fixed');
    }
}


$(document).ready(function() {
    var LOCATION = 1000;

    console.log("ready");
    $(window).scroll(function () {
        checkNavbar(LOCATION);
    });
});
