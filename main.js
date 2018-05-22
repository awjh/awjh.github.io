let show_nav = false;

function handleNavBar() {
    show_nav = !show_nav;

    if (show_nav) {
        $('#nav').css('display', 'block');
    } else {
        $('#nav').css('display', 'none');
    }
}