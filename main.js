// ฟังก์ชันสำหรับกรองรายการบนการ์ดตามหมวดหมู่ dropdown และคำค้นหา
function filterCardItems(category, searchTerm) {
    const cards = document.querySelectorAll('.card');
    let found = false; // เพิ่มตัวแปรเพื่อตรวจสอบว่าพบการ์ดที่ตรงหรือไม่

    cards.forEach(card => {
        const title = card.querySelector('.card-title').textContent.trim().toLowerCase();
        const categoryMatch = category === 'ทั้งหมด' || title.includes(category.toLowerCase());
        const searchTermMatch = searchTerm === '' || title.includes(searchTerm.toLowerCase());

        const isVisible = categoryMatch && searchTermMatch;
        card.style.display = isVisible ? '' : 'none';

        if (isVisible) {
            found = true; // ตั้งค่าเป็น true เมื่อพบการ์ดที่ตรง
        }
    });

    // หากไม่พบข้อมูล แสดงข้อความ "ไม่พบข้อมูล"
    if (!found) {
        const container = document.getElementById('card-container');
        container.innerHTML = '<p class="text-center">ไม่พบข้อมูล</p>';
    }
}

// ฟังก์ชันสำหรับการจัดการการกรองข้อมูลตาม dropdown และคำค้นหา
function handleFiltering(category, searchTerm) {
    filterCardItems(category, searchTerm);
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

// เก็บค่าเริ่มต้นของ dropdown และ search
const initialDropdownText = 'ทั้งหมด';
const initialSearchText = '';


// การคลิกที่ปุ่มค้นหา
document.getElementById('searchButton').addEventListener('click', () => {
    const selectedCategory = document.querySelector('.btn-group .btn-danger').textContent.trim();
    const searchTerm = document.querySelector('.form-control').value.trim().toLowerCase();

    handleFiltering(selectedCategory, searchTerm);
});

// การคลิกที่รายการ dropdown
document.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', () => {
        const category = item.closest('.btn-group').querySelector('.btn-danger').textContent.trim();
        const selectedValue = item.textContent.trim();

        updateDropdownButtonLabel(category, selectedValue);
        
        // Check if the selectedValue is empty (indicating reset to all categories)
        if (selectedValue === 'ทั้งหมด') {
            handleFiltering('', ''); // Reset filter
        } else {
            handleFiltering(selectedValue, ''); // Filter by selected category
        }
    });
});

// ข้อมูลจำลองสำหรับการ์ด (แทนที่ด้วยข้อมูลจริงหรือการโหลดแบบไดนามิก)
const cardItems = [
    { image: './kitdat/ECAG44.jpg', title: 'ECAG44' },
    { image: './kitdat/ECAG45.jpg', title: 'ECAG45' },
    { image: './kitdat/ECAx49.jpg', title: 'ECAx49' },
    { image: './kitdat/ECAx50.jpg', title: 'ECAx50' },
    { image: './kitdat/ECAG44.jpg', title: 'ECAG44' },
    { image: './kitdat/ECAG45.jpg', title: 'ECAG45' },
    { image: './kitdat/ECAx49.jpg', title: 'ECAx49' },
    { image: './kitdat/ECAx50.jpg', title: 'ECAx50' },
    { image: './kitdat/ECAG44.jpg', title: 'ECAG44' },
    { image: './kitdat/ECAG45.jpg', title: 'ECAG45' },
    { image: './kitdat/ECAx49.jpg', title: 'ECAx49' },
    { image: './kitdat/ECAx50.jpg', title: 'ECAx50' },
    // เพิ่มข้อมูลการ์ดเพิ่มเติมตามต้องการ
];

// ฟังก์ชันสำหรับสร้างองค์ประกอบการ์ด
function createCardElements(cards) {
    const container = document.getElementById('card-container');
    container.innerHTML = '';

    cards.forEach(card => {
        const cardElement = `
            <div class="col">
                <div class="card shadow-sm">
                    <img src="${card.image}" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">${card.title}</h5>
                        <p class="card-text">นี่คือการ์ดที่มีข้อความสนับสนุนด้านล่างเป็นส่วนเสริมธรรมชาติ ข้อความนี้ยาวเล็กน้อย</p>
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

// เรียกใช้ฟังก์ชันสำหรับสร้างองค์ประกอบการ์ด
createCardElements(cardItems);

// ตัวควบคุมหน้า (หากมีการใช้งาน)

// ตั้งค่าเปลี่ยนหน้า
const itemsPerPage = 10;
const totalItems = 50;
const totalPages = Math.ceil(totalItems / itemsPerPage);


// ปุ่่มไป-กลับ & เลขหน้า
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
}

let currentPage = 1;

function changePage(page) {
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;

    currentPage = page;

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    const container = document.getElementById('card-container');
    const cards = container.querySelectorAll('.col');

    cards.forEach((card, index) => {
        if (index >= start && index < end) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });

    updatePaginationButtons();
}

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

createPagination();
changePage(1);
