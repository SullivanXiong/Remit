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
    var payer = $('#payer').val();
    var payee = $('#payee').val();
    var authPassword = $('#authPassword').val();
    var amount = $('#payAmount')

    $.ajax({
        type: "POST",
        url: "http://localhost:1338/transactionDetails",
        // The key needs to match your method's input parameter (case-sensitive).
        data: JSON.stringify({ sender: payer, receiver: payee, amount: amount }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: triggerSuccess(),
        failure: function(errMsg) {
            alert(errMsg);
        }
    });
    console.log("asdf");

}

function triggerSuccess() {
    var auth = document.getElementById("auth");
    var success = document.getElementById("success");
    auth.style.display = "none";
    success.style.display = "block";
}

