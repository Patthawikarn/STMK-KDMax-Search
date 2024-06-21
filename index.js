// scripts.js
document.getElementById('loginForm').addEventListener('submit', function(event) {
  event.preventDefault();
  
  var employeeCode = document.getElementById('floatingInput').value;
  var password = document.getElementById('floatingPassword').value;
  
  if(employeeCode.trim() === '' || password.trim() === '') {
    alert('Please enter both employee code and password.');
  } else {
    // สำหรับตัวอย่างเราจะใช้ setTimeout เพื่อจำลองการเชื่อมต่อ API ที่จะมีการตอบกลับในอนาคต
    setTimeout(() => {
      handleResponse({ Status: "OK" });
    }, 1000); // จำลองการเชื่อมต่อโดยใช้ setTimeout

    // ฟังก์ชันจัดการของการตอบกลับ
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
