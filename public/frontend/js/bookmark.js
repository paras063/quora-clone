const bookmarkQues = document.querySelector('#bookmark-ques');
if (bookmarkQues) {
  const notBookmarked = bookmarkQues.querySelector('i.far'),
    bookmarked = bookmarkQues.querySelector('i.fas');
  const saveBookmark = (e) => {
    const quesId = bookmarkQues.querySelector('div').textContent;
    fetch(`/bookmark/${quesId}`, {
      method: 'GET',
      headers: { 'Content-type': 'application/json' },
    })
      .then((res) => res.json())
      .then(() => {
        notBookmarked.classList.toggle('hide');
        bookmarked.classList.toggle('hide');
      });
  };

  notBookmarked.addEventListner('click', saveBookmark);
  bookmarked.addEventListner('click', saveBookmark);
}
