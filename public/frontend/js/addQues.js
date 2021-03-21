/*
Types Of Connection between SerVer & Client

#1 TCP 
  Pages Genereation And Render Page  

#2 UDP
  Client And Server Exchange Data Only
  May be in (**JSON, XML)
  Fetch,XML,Axios


*/

const form = document.querySelector("form#add-question");
const quesTitle = document.getElementById("quesTitle");
const quesBody = document.getElementById("quesBody");
const quesTags = document.getElementById("quesTags");
const errorAlert = document.querySelector(".alert.alert-danger");
const successAlert = document.querySelector(".alert.alert-success");
const _csrf = document.getElementById("_csrf").value;

form.addEventListener("submit", (e) => {
  // Prevent Deafult Submit Action
  e.preventDefault();

  // Checking Input Values
  if (!quesTitle.value.trim()) {
    quesTitle.style.borderColor = "red";
    quesTitle.nextElementSibling.classList.remove("hide");
  }
  if (!quesBody.value.trim()) {
    quesBody.style.borderColor = "red";
    quesBody.nextElementSibling.classList.remove("hide");
  }
  if (!quesTags.value.trim()) {
    quesTags.style.borderColor = "red";
    quesTags.nextElementSibling.classList.remove("hide");
  }

  // if Input Are Empty Return
  if (!quesTitle.value || !quesBody.value || !quesTags.value) return;

  const body = {
    quesTitle: quesTitle.value,
    quesBody: quesBody.value,
    quesTags: quesTags.value,
    _csrf,
  };

  fetch("/add-question", {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .then((data) => {
      if (!data.success) {
        data.errors.forEach((e) => {
          let field = document.getElementById(e.param);
          field.style.borderColor = "red";
          field.nextElementSibling.classList.remove("hide");
        });
      } else {
        successAlert.classList.remove("hide");
        successAlert.textContent = "Your Question Got Submit";
        setTimeout(() => {
          location.reload();
        }, 2000);
      }
    });
});
