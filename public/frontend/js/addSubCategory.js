const form = document.querySelector("form#add-subInterest");
const tag = document.getElementById("interest");
const subFields = document.getElementById("subFields");
const errorAlert = document.querySelector(".alert.alert-danger");
const successAlert = document.querySelector(".alert.alert-success");
const _csrf = document.getElementById("_csrf").value;

form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!tag.value.trim()) {
    tag.style.borderColor = "red";
    tag.nextElementSibling.classList.remove("hide");
  }

  if (!subFields.value.trim()) {
    tag.style.borderColor = "red";
    tag.nextElementSibling.classList.remove("hide");
  }

  if (!tag.value || !subFields.value) return;

  const body = {
    tag: tag.value,
    subFields: subFields.value,
    _csrf,
  };

  fetch("/add-category", {
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
          successAlert.classList.remove("hide");
          errorAlert.textContent = "Sub-Category already exists";
        });
      } else {
        successAlert.classList.remove("hide");
        successAlert.textContent = "Sub-Category added Successfully";
        setTimeout(() => {
          location.reload();
        }, 2000);
      }
    });
});
