function showCreate() {
    var create = document.getElementById("create-account");
    var initCreate = document.getElementById("initCreate");
    var initPay = document.getElementById("initPay");
    create.style.display = "block";
    initCreate.style.display = "none";
    initPay.style.display = "none";
}

function showPay() {
    var pay = document.getElementById("pay");
    var initCreate = document.getElementById("initCreate");
    var initPay = document.getElementById("initPay");
    pay.style.display = "block";
    initCreate.style.display = "none";
    initPay.style.display = "none";
}

function payMoney() {
    var pay = document.getElementById("pay");
    var auth = document.getElementById("auth");
    pay.style.display = "none";
    auth.style.display = "block";
}

function authUser() {
    var auth = document.getElementById("auth");
    var success = document.getElementById("success");
    auth.style.display = "none";
    success.style.display = "block";
}