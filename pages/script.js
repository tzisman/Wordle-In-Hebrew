
document.querySelector(".icon-start").addEventListener('mousedown', function (event) {
    let icon=document.querySelector(".icon-start");
    icon.classList.add('icon-click');
    console.log(event.target.classList)
    setTimeout(() => {
        icon.classList.remove('icon-click');
    }, 170);

    setTimeout(() => {
        window.location.href = "pages/game.html";
    }, 500);
});


