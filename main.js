// ค่าเริ่มต้นของ dropdown และ search
const initialDropdownText = 'ทั้งหมด';
const initialSearchText = '';

// จำนวนการ์ดต่อหน้า
const itemsPerPage = 50;
let totalItems = 0;
let totalPages = 0;
let currentPage = 1;
let allCards = [];

// เมื่อโหลดเสร็จให้เรียกฟังก์ชัน fetchCardItems
window.addEventListener('load', () => {
    fetchCardItems();

    const dropdown = document.getElementById('dropdown-menu'); // ต้องแก้ ID ให้ตรงกับที่ใช้ใน HTML
    const searchInput = document.getElementById('searchInput'); // ต้องแก้ ID ให้ตรงกับที่ใช้ใน HTML

    dropdown.addEventListener('change', () => {
        const category = dropdown.value;
        const searchTerm = searchInput.value.trim().toLowerCase();
        filterCardItems(category, searchTerm);
    });

    searchInput.addEventListener('input', () => {
        const category = dropdown.value;
        const searchTerm = searchInput.value.trim().toLowerCase();
        filterCardItems(category, searchTerm);
    });
});

// dropdown และ ค้นหา
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

    const container = document.getElementById('card-container');
    container.innerHTML = found ? '' : '<p class="text-center">ไม่พบข้อมูล</p>';
}

// องค์ประกอบการ์ด
function createCardElements(cards) {
    const container = document.getElementById('card-container');
    container.innerHTML = '';

    cards.forEach(card => {
        const { PreviewPic, UrlImage, Desc } = card;

        const cardElement = `
            <div class="col">
                <div class="card shadow-sm">
                    <img src="${UrlImage}" class="card-img-top" alt="">
                    <div class="card-body">
                        <p class="card-title">${PreviewPic}</p>
                        <p class="card-title-2">${Desc}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="btn-group">
                                <button type="button" class="btn btn-sm btn-outline-secondary">โหลด</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', cardElement);
    });

    if (cards.length === 0) {
        container.innerHTML = '<p class="text-center">ไม่พบข้อมูล</p>';
    }
}

// เรียกใช้ข้อมูลจาก API
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
            console.log('API data:', data); // โครงสร้างของข้อมูล

            const cards = data.Data;

            if (!Array.isArray(cards)) {
                throw new Error('Expected array but got ' + typeof cards);
            }

            allCards = cards;
            totalItems = cards.length;
            totalPages = Math.ceil(totalItems / itemsPerPage);

            createCardElements(cards.slice(0, itemsPerPage));
            createPagination();
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

// สร้างปุ่มไป-กลับ & เลขหน้า
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

// เปลี่ยนหน้า
function changePage(page) {
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;

    currentPage = page;

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    createCardElements(allCards.slice(start, end));
    updatePaginationButtons();
}

// อัปเดตปุ่ม pagination
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
