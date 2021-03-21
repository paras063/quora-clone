const answerContainer = document.querySelector("#answerSec");
const answer = document.querySelector("#answer");
const quesId = document.querySelector("#quesId").value;
const _csrf = document.querySelector("#_csrf").value;
const ansBtn = answerContainer.querySelector("button");

ansBtn.addEventListener("click", (e) => {
  e.preventDefault();

  if (!answer.value.trim()) {
    answer.style.borderColor = "red";
    answer.nextElementSibling.classList.remove("hide");
  }

  const body = {
    answer: answer.value,
    quesId,
    _csrf,
  };

  fetch(`/add-answer`, {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .then((data) => {
      if (!data.success) {
        answer.style.borderColor = "red";
        answer.nextElementSibling.classList.remove("hide");
      } else {        
        answer.style.borderColor = "green";
        answer.nextElementSibling.classList.remove("hide");
        answer.nextElementSibling.textContent = "SuccessFully Added";
        answer.nextElementSibling.classList = 'text-success'

        // TODO: Adding ans to Doc
        

      }
    });
});
