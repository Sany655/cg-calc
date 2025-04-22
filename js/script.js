$(document).ready(function () {
    var data = JSON.parse(localStorage.getItem('user') || null);
    var currentPage = window.location.pathname.split('/').pop();

    if ((!data || !data.isLoggedIn) && currentPage !== 'login.html') {
        window.location.href = './login.html';
    }

    $("#logout-button").click(function () {
        data = JSON.parse(localStorage.getItem('user'));
        localStorage.setItem("user", JSON.stringify({ ...data, isLoggedIn: false }));
        window.location.href = "./login.html";
    });

})