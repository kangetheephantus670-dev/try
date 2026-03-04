// Admin login form
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    const messageDiv = document.getElementById('loginMessage');

    if (response.ok) {
      messageDiv.textContent = 'Login successful! Redirecting...';
      messageDiv.classList.add('success');
      messageDiv.classList.remove('error');
      
      setTimeout(() => {
        window.location.href = '/admin/dashboard';
      }, 1500);
    } else {
      messageDiv.textContent = data.error || 'Login failed';
      messageDiv.classList.add('error');
      messageDiv.classList.remove('success');
    }
  } catch (error) {
    console.error('Error:', error);
    const messageDiv = document.getElementById('loginMessage');
    messageDiv.textContent = 'Error connecting to server';
    messageDiv.classList.add('error');
    messageDiv.classList.remove('success');
  }
});
