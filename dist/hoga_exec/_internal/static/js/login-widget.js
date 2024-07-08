console.log("LoginWidget Loaded")

document
.getElementById("resetPasswordBtn")
.addEventListener("click", function () {
  document.getElementById("userlogin").style.display = "none";
  document.querySelector(".head-login p").style.display = "none";
  document.getElementById("resetForm").style.display = "block";
});

document
.getElementById("submitReset")
.addEventListener("click", function () {
  document.getElementById("resetForm").style.display = "none";
  document.getElementById("thankYou").style.display = "block";
});

/* document
.getElementById("thanksReset")
.addEventListener("click", function () {
  document.getElementById("thankYou").style.display = "none";
  document.getElementById("userlogin").style.display = "block";
  document.querySelector(".head-login p").style.display = "block";
}); */