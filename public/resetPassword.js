document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    document.getElementById('token').value = token;
  
    document.getElementById('resetPasswordForm').addEventListener('submit', function(event) {
      const newPassword = document.getElementById('newPassword').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
      const errorElement = document.getElementById('error');
  
      if (newPassword !== confirmPassword) {
        event.preventDefault();
        errorElement.textContent = 'Passwords do not match!';
      } else {
        errorElement.textContent = '';
      }
    });
  });
  