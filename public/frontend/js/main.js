/* ----------------
1. Side Bar Menu
2. Backdrop
3. Close Button
---------------- */

const backdrop = document.querySelector('.backdrop');
const togglerMobile = document.querySelector('#mobile-nav #userAction');
const togglerDesktop = document.querySelector('#main-nav #userAction');
const userMenu = document.querySelector('#userActionMenu');
const closeBtn = document.querySelector('#userActionMenu #closeBtn');

/*  ----------  Navbar Open and Close  ----------  */
closeBtn.addEventListener('click', () => {
  backdrop.classList.add('hide');
  userMenu.classList.add('hide');
});

backdrop.addEventListener('click', () => {
  backdrop.classList.add('hide');
  userMenu.classList.add('hide');
});

togglerMobile.addEventListener('click', () => {
  backdrop.classList.remove('hide');
  userMenu.classList.remove('hide');
});

togglerDesktop.addEventListener('click', () => {
  backdrop.classList.remove('hide');
  userMenu.classList.remove('hide');
});
