document.getElementById('loginForm').addEventListener('submit', function(event) {
  event.preventDefault();

  var employeeCode = document.getElementById('floatingInput').value;
  var password = document.getElementById('floatingPassword').value;

  if (employeeCode.trim() === '' || password.trim() === '') {
    alert('Please enter both employee code and password.');
  } else {
    setTimeout(() => {
      handleResponse({ Status: "OK" });
    }, 1000);

    function handleResponse(data) {
      if (data.Status == "OK") {
        alert('Login successful!');
        window.location.href = "./main.html";
      } else {
        alert('Login failed. Please try again.');
      }
    }
  }
});
