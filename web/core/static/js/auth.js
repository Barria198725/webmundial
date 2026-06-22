document.addEventListener('DOMContentLoaded', function(){
  const form = document.getElementById('login-form');
  const loginLink = document.getElementById('navbar-login-link');
  const navbarUser = document.getElementById('navbar-user');
  const userMenu = document.getElementById('user-menu');
  const userMenuToggle = document.getElementById('user-menu-toggle');
  const logoutButton = document.getElementById('logout-button');
  const userName = document.getElementById('navbar-user-name');
  const userEmail = document.getElementById('navbar-user-email');
  const userPoints = document.getElementById('navbar-user-points');
  const userAvatar = document.getElementById('navbar-user-avatar');

  const user = JSON.parse(localStorage.getItem('user') || 'null');

  if (user && navbarUser && loginLink && userName && userEmail && userPoints && userAvatar) {
    loginLink.hidden = true;
    navbarUser.hidden = false;
    userName.textContent = user.name || user.email || 'Usuario';
    userEmail.textContent = user.email || '';
    userPoints.textContent = user.points != null ? user.points : '0';
    userAvatar.textContent = user.name ? user.name[0].toUpperCase() : 'U';

    userMenuToggle?.addEventListener('click', function(e){
      e.stopPropagation();
      userMenu?.classList.toggle('show');
    });

    logoutButton?.addEventListener('click', function(){
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      window.location.href = '/';
    });

    document.addEventListener('click', function(event){
      if (!userMenu?.contains(event.target) && event.target !== userMenuToggle) {
        userMenu?.classList.remove('show');
      }
    });
  } else if (loginLink) {
    loginLink.hidden = false;
    if (navbarUser) navbarUser.hidden = true;
  }

  if(!form) return;

  form.addEventListener('submit', async function(e){
    e.preventDefault();
    const email = form.email.value.trim();
    const password = form.password.value;

    const url = (window.API_BASE_URL || '') + '/auth/login';
    try{
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if(resp.ok){
        const data = await resp.json();
        localStorage.setItem('user', JSON.stringify(data.user || { email }));
        if(data.token) localStorage.setItem('token', data.token);
        window.location.href = '/profile/';
        return;
      }
    }catch(err){
      // ignore and fallback to mock
    }

    localStorage.setItem('user', JSON.stringify({ email }));
    window.location.href = '/profile/';
  });
});
