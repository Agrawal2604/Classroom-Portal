const form = document.getElementById('loginForm');
const msg = document.getElementById('msg');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  try {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      msg.textContent = '✅ Login successful!';
      msg.style.color = 'green';

      // Save token to localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);

      // Redirect after short delay
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1000);
    } else {
      msg.textContent = data.message || '❌ Invalid credentials';
      msg.style.color = 'red';
    }
  } catch (error) {
    msg.textContent = '⚠️ Server not responding';
    msg.style.color = 'red';
  }
});
