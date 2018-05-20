$(document).ready(function() {
    console.log("ready");
    $(window).scroll(function () {
        //if you hard code, then use console
        //.log to determine when you want the
        //nav bar to stick.
        console.log($(window).scrollTop())
        if ($(window).scrollTop() > 1000) {
            $('#nav_bar').display = 'block';
            $('#nav_bar').addClass('navbar-fixed');
        }
        if ($(window).scrollTop() < 1001) {
            $('#nav_bar').display='none';
            $('#nav_bar').removeClass('navbar-fixed');
        }
    });
});
