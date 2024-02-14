$('.container2').slick({
    infinite: true,
    slidesToShow: 1,
    arrows:true,
    prevArrow:'.privarrow',
    nextArrow:'.nextarrow',
    autoplay: true,
    autoplayTimeout: 5,
    loop: true,
    slidesToScroll: 1,
    dots: true,
    fade: true,
    speed: 500,
    cssEase: 'linear'
});
$('.priv').click(function () {
    $('.container2').slick('slickPrev');
});

$('.next').click(function () {
    $('.container2').slick('slickNext');
});
 