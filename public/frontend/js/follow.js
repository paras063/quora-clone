const interestArea = document.querySelectorAll(".interests");

if (interestArea) {
  for (const b of interestArea) {
    const interestId = b.querySelector("#interestId").value;
    const followed = b.querySelector(".follow");
    const notFollowed = b.querySelector(".followed");
    followed.addEventListener(
      "click",
      doFollow.bind(this, interestId, followed, notFollowed)
    );

    notFollowed.addEventListener(
      "click",
      doFollow.bind(this, interestId, followed, notFollowed)
    );
  }
}

function doFollow(interestId, followed, notFollowed) {
  fetch(`/follow-interest/${interestId}`, {
    method: "GET",
    headers: { "Content-type": "application/json" },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      followed.classList.toggle("hide");
      notFollowed.classList.toggle("hide");
    });
}
