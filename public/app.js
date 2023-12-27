$(window).scroll(function(){
    var scrollPos=$(this).scrollTop();
    $('.banner').css('background-position-x', scrollPos/2 + 'px');
});
$(window).scroll(function(){
    var scrollPos=$(this).scrollTop();
    $('#aboutSection').css('background-position-x', -scrollPos/3 + 'px');
});