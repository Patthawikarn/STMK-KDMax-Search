// scripts.js
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    var employeeCode = document.getElementById('floatingInput').value;
    var password = document.getElementById('floatingPassword').value;
    
    if(employeeCode.trim() === '' || password.trim() === '') {
      alert('Please enter both employee code and password.');
    } else {
      // ตัวอย่างของการตอบกลับสำหรับการเข้าสู่ระบบ
      var mockApiResponse = {
        Status: "OK"
      };
  
      // ส่งข้อมูลกลับ
      setTimeout(() => {
        handleResponse(mockApiResponse);
      }, 1000); // จำลองการเชื่อมต่อโดยใช้ setTimeout
  
      // ฟังก์ชันจัดการการตอบกลับ
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
  