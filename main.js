// ปรับค่า itemsPerPage เป็น 50
const itemsPerPage = 50;
let totalItems = 0; // จำนวนรายการทั้งหมด
let totalPages = 0; // จำนวนหน้าทั้งหมด
let currentPage = 1; // หน้าปัจจุบัน

// ฟังก์ชันสำหรับกรองรายการบนการ์ดตามหมวดหมู่ dropdown และคำค้นหา
function filterCardItems(category, searchTerm) {
    const cards = document.querySelectorAll('.card');
    let found = false;

    cards.forEach(card => {
        const title = card.querySelector('.card-title').textContent.trim().toLowerCase();
        const categoryMatch = category === 'ทั้งหมด' || title.includes(category.toLowerCase());
        const searchTermMatch = searchTerm === '' || title.includes(searchTerm.toLowerCase());

        const isVisible = categoryMatch && searchTermMatch;
        card.style.display = isVisible ? '' : 'none';

        if (isVisible) {
            found = true;
        }
    });

    if (!found) {
        const container = document.getElementById('card-container');
        container.innerHTML = '<p class="text-center">ไม่พบข้อมูล</p>';
    }
}

// ฟังก์ชันสำหรับสร้างองค์ประกอบการ์ดที่รับ URL ของภาพเป็นพารามิเตอร์
function createCardElements(cards) {
    const container = document.getElementById('card-container');
    container.innerHTML = '';

    cards.forEach(card => {
        const { PreviewPic, DoorShapeCode, Desc } = card; // ปรับตามโครงสร้างของข้อมูลจาก API

        const cardElement = `
            <div class="col-6 col-md-4 col-lg-3 mb-4">
                <div class="card h-100 shadow-sm">
                    <img src="${PreviewPic}" class="card-img-top" alt="${DoorShapeCode}">
                    <div class="card-body">
                        <h5 class="card-title">${Desc}</h5>
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="btn-group">
                                <button type="button" class="btn btn-sm btn-outline-secondary">ดู</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', cardElement);
    });
}

// ฟังก์ชันสำหรับเรียกใช้ API เพื่อดึงข้อมูลการ์ด
function fetchCardItems() {
    const apiUrl = 'https://starmark.work/kdmaxsearch/api/file/mdb=doorstyle';

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('API data:', data); // ตรวจสอบโครงสร้างของข้อมูลที่ได้รับ

            // ปรับตามโครงสร้างของข้อมูลที่ได้รับจาก API
            const cards = data.Data; // ข้อมูลการ์ดอยู่ใน data.Data

            if (!Array.isArray(cards)) {
                throw new Error('Expected array but got ' + typeof cards);
            }

            totalItems = cards.length;
            totalPages = Math.ceil(totalItems / itemsPerPage);

            createCardElements(cards);
            createPagination();
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

// เรียกใช้ฟังก์ชันสำหรับดึงข้อมูลการ์ดจาก API เมื่อหน้าเว็บโหลดเสร็จสมบูรณ์
window.addEventListener('load', fetchCardItems);

// ฟังก์ชันสำหรับสร้าง pagination
function createPagination() {
    const paginationContainer = document.getElementById('pagination-container');
    paginationContainer.innerHTML = '';

    const prevButton = document.createElement('li');
    prevButton.classList.add('page-item');
    prevButton.innerHTML = '<a class="page-link" href="#">Previous</a>';
    prevButton.addEventListener('click', () => changePage(currentPage - 1));
    paginationContainer.appendChild(prevButton);

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('li');
        pageButton.classList.add('page-item');
        pageButton.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        pageButton.addEventListener('click', () => changePage(i));
        paginationContainer.appendChild(pageButton);
    }

    const nextButton = document.createElement('li');
    nextButton.classList.add('page-item');
    nextButton.innerHTML = '<a class="page-link" href="#">Next</a>';
    nextButton.addEventListener('click', () => changePage(currentPage + 1));
    paginationContainer.appendChild(nextButton);

    updatePaginationButtons();
}

// ฟังก์ชันสำหรับเปลี่ยนหน้า
function changePage(page) {
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;

    currentPage = page;

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    const container = document.getElementById('card-container');
    const cards = container.querySelectorAll('.col-6');

    cards.forEach((card, index) => {
        if (index >= start && index < end) {
            card.style.display = 'block'; // แสดงการ์ด
        } else {
            card.style.display = 'none'; // ซ่อนการ์ด
        }
    });

    updatePaginationButtons();
}

// ฟังก์ชันสำหรับอัปเดตปุ่ม pagination
function updatePaginationButtons() {
    const paginationContainer = document.getElementById('pagination-container');
    const pageButtons = paginationContainer.querySelectorAll('.page-item');

    pageButtons.forEach((button, index) => {
        if (index === 0) {
            button.classList.toggle('disabled', currentPage === 1);
        } else if (index === pageButtons.length - 1) {
            button.classList.toggle('disabled', currentPage === totalPages);
        } else {
            button.classList.toggle('active', index === currentPage);
        }
    });
}

// ฟังก์ชันสำหรับอัปเดตป้ายกำกับปุ่ม dropdown
function updateDropdownButtonLabel(category, selectedValue) {
    const dropdowns = document.querySelectorAll('.btn-group');

    dropdowns.forEach(dropdown => {
        const button = dropdown.querySelector('.btn-danger');

        if (button.textContent.trim() === category) {
            button.textContent = selectedValue;
        }
    });
}

// ตั้งค่าเริ่มต้นของ dropdown และ search
const initialDropdownText = 'ทั้งหมด';
const initialSearchText = '';