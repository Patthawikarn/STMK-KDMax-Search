 
// ฟังก์ชันสำหรับกรองรายการในเมนู dropdown โดยใช้คำค้นหา
function filterDropdownItems(searchTerm) {
    const dropdownMenus = document.querySelectorAll('.dropdown-menu');

    dropdownMenus.forEach(menu => {
        const items = menu.querySelectorAll('.dropdown-item');

        items.forEach(item => {
            const text = item.textContent.toLowerCase();
            const isVisible = text.includes(searchTerm.toLowerCase());
            item.style.display = isVisible ? 'block' : 'none';
        });
    });
}

// ฟังก์ชันสำหรับเปลี่ยนข้อความบนปุ่ม dropdown ตามหัวข้อที่เลือก
function changeDropdownButtonLabel(category, selectedValue) {
    const dropdowns = document.querySelectorAll('.btn-group');

    dropdowns.forEach(dropdown => {
        const button = dropdown.querySelector('.btn-danger');

        if (button.textContent.trim() === category) {
            button.textContent = selectedValue;
        }
    });
}

// จัดการเหตุการณ์คลิกปุ่มค้นหา
document.getElementById('searchButton').addEventListener('click', () => {
    const searchTerm = document.querySelector('.form-control').value.trim();
    filterDropdownItems(searchTerm);
});

// รีเซ็ตรายการ dropdown เมื่อฟิลด์ input ค้นหามีการโฟกัส
document.querySelector('.form-control').addEventListener('focus', () => {
    filterDropdownItems('');
});

// จัดการเหตุการณ์คลิกที่รายการ dropdown
document.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', () => {
        const category = item.closest('.btn-group').querySelector('.btn-danger').textContent.trim();
        const selectedValue = item.textContent.trim();
        changeDropdownButtonLabel(category, selectedValue);
    });
});


 
// แสดงข้อมูลรูป
const cardTemplate = `
<div class="col">
    <div class="card shadow-sm">
        <svg class="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c"></rect><text x="50%" y="50%" fill="#eceeef" dy=".3em">Thumbnail</text></svg>
        <div class="card-body">
            <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
            <div class="d-flex justify-content-between align-items-center">
                <div class="btn-group">
                    <button type="button" class="btn btn-sm btn-outline-secondary">View</button>
                </div>
            </div>
        </div>
    </div>
</div>
`;

// Function to create and append multiple cards
function createCards(count) {
const container = document.getElementById('card-container');
for (let i = 0; i < count; i++) {
    container.insertAdjacentHTML('beforeend', cardTemplate);
}
}

// จำนวนภาพ
createCards(25);




// ตั้งค่าเปลี่ยนหน้า
const itemsPerPage = 10;
const totalItems = 50;
const totalPages = Math.ceil(totalItems / itemsPerPage);

function createPagination() {
    const paginationContainer = document.getElementById('pagination-container');
    paginationContainer.innerHTML = '';

    // Previous button
    const prevButton = document.createElement('li');
    prevButton.classList.add('page-item');
    prevButton.innerHTML = '<a class="page-link" href="#">Previous</a>';
    prevButton.addEventListener('click', () => changePage(currentPage - 1));
    paginationContainer.appendChild(prevButton);

    // Page number buttons
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('li');
        pageButton.classList.add('page-item');
        pageButton.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        pageButton.addEventListener('click', () => changePage(i));
        paginationContainer.appendChild(pageButton);
    }

    // Next button
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

// Initialize pagination
createPagination();
changePage(1);