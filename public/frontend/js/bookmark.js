const bookmarks = document.querySelectorAll('#bookmark-ques');
// let notBookmarked, bookmarked, quesId;
if (bookmarks) {
  for (const b of bookmarks) {
    const notBookmarked = b.querySelector('i.far');
    const bookmarked = b.querySelector('i.fas');
    const quesId = b.querySelector('#quesId').value.trim();
    bookmarked.addEventListener(
      'click',
      saveBookmark.bind(this, quesId, notBookmarked, bookmarked)
    );
    notBookmarked.addEventListener(
      'click',
      saveBookmark.bind(this, quesId, notBookmarked, bookmarked)
    );
  }
}

function saveBookmark(quesId, notBookmarked, bookmarked) {
  fetch(`/bookmark/${quesId}`, {
    method: 'GET',
    headers: { 'Content-type': 'application/json' },
  })
    .then((res) => res.json())
    .then(() => {
      notBookmarked.classList.toggle('hide');
      bookmarked.classList.toggle('hide');
    });
}
