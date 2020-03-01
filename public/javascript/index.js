function showCreate() {
    var create = document.getElementById("create-account");
    var initCreate = document.getElementById("initCreate");
    var initPay = document.getElementById("initPay");
    var initBalance = document.getElementById("initBalance");
    create.style.display = "block";
    initCreate.style.display = "none";
    initPay.style.display = "none";
    initBalance.style.display = "none";
}

function showPay() {
    var pay = document.getElementById("pay");
    var initCreate = document.getElementById("initCreate");
    var initPay = document.getElementById("initPay");
    var initBalance = document.getElementById("initBalance");

    pay.style.display = "block";
    initCreate.style.display = "none";
    initPay.style.display = "none";
    initBalance.style.display = "none";
}

function showBalance() {
    var pay = document.getElementById("pay");
    var initCreate = document.getElementById("initCreate");
    var initPay = document.getElementById("initPay");
    var initBalance = document.getElementById("initBalance");
    pay.style.display = "none";
    initCreate.style.display = "none";
    initPay.style.display = "none";
    initBalance.style.display = "block";
}

function payMoney() {
    var pay = document.getElementById("pay");
    var auth = document.getElementById("auth");
    pay.style.display = "none";
    auth.style.display = "block";
}

function authUser() {
    var payer = $('#payer').val();
    var payee = $('#payee').val();
    var authPassword = $('#authPassword').val();
    var payAmount = $('#payAmount').val();

    $.ajax({
        method: "POST",
        url: "https://remit3p.herokuapp.com/transactionDetails",
        // The key needs to match your method's input parameter (case-sensitive).
        data: JSON.stringify({ sender: payer, receiver: payee, amount: payAmount }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: triggerSuccess(),
        failure: function(errMsg) {
            alert(errMsg);
        }
    });

}

function triggerSuccess() {
    var auth = document.getElementById("auth");
    var success = document.getElementById("success");
    auth.style.display = "none";
    success.style.display = "block";
}

