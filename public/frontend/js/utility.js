// Toggle
function togglePass() {
  const x = document.getElementById('password');
  if (x.type === 'password') {
    x.type = 'text';
  } else {
    x.type = 'password';
  }
}

// Customer Ratings Display
const userRating = document.querySelectorAll('.userRating');
if (userRating) {
  const ratings = [];

  userRating.forEach((rating) => {
    ratings.push(rating.value);
  });

  // Total Stars
  const starsTotal = 5;

  // Run getRatings when DOM loads
  document.addEventListener('DOMContentLoaded', getRatings);

  // Get ratings
  function getRatings() {
    ratings.forEach((rating, idx) => {
      // Get percentage
      const starPercentage = (rating / starsTotal) * 100;
      // Round to nearest 10
      const starPercentageRounded = `${Math.round(starPercentage / 10) * 10}%`;
      // Set width of stars-inner to percentage
      document.querySelectorAll(`.stars-inner`)[
        idx
      ].style.width = starPercentageRounded;
    });
  }
}

// Filter List
const filterInput = document.querySelector('#SearchCustomer');
if (filterInput) {
  const filterCustomer = () => {
    let filterValue = filterInput.value.toUpperCase();
    // Get All tr in tbody
    const trs = document.querySelectorAll('tbody tr');

    for (let tr = 0; tr < trs.length; tr++) {
      const name = trs[tr].querySelectorAll('td')[0];
      const email = trs[tr].querySelectorAll('td')[1];
      const mob = trs[tr].querySelectorAll('td')[2];

      if (email.textContent.toUpperCase().indexOf(filterValue) > -1) {
        trs[tr].style.display = '';
      } else if (name.textContent.toUpperCase().indexOf(filterValue) > -1) {
        trs[tr].style.display = '';
      } else if (mob.textContent.toUpperCase().indexOf(filterValue) > -1) {
        trs[tr].style.display = '';
      } else {
        trs[tr].style.display = 'none';
      }
    }
  };
  filterInput.addEventListener('keyup', filterCustomer);
}

// Searching Videos
const searchVideo = document.querySelector('#searchVideo');
if (searchVideo) {
  const filterVideos = () => {
    let filterValue = searchVideo.value.toUpperCase();
    // Get All tr in tbody
    const videoBox = document.querySelectorAll('.videoBox');    
    for (let video = 0; video < videoBox.length; video++) {
      const videoTitle = videoBox[video].querySelector('h3');      
      if (videoTitle.textContent.toUpperCase().indexOf(filterValue) > -1) {
        videoBox[video].style.display = '';
      } else {
        videoBox[video].style.display = 'none';
      }
    }
  };
  searchVideo.addEventListener('keyup', filterVideos);
}
