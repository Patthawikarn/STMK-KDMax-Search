// scripts.js
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    var employeeCode = document.getElementById('floatingInput').value;
    var password = document.getElementById('floatingPassword').value;
    
    if(employeeCode.trim() === '' || password.trim() === '') {
      alert('Please enter both employee code and password.');
    } else {
      fetch("/api/login", { // เรียกไปที่ Proxy Server ที่คุณสร้างขึ้นมา
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          Username: employeeCode,
          Password: password
        })
      })
      .then(response => response.json())
      .then(data => {
        if (data.Status == "OK") {
          alert('Login successful!');
          window.location.href = "./main.html";
        } else {
          alert('Login failed. Please try again.');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Login failed. Please try again.');
      });
    }
  });
  