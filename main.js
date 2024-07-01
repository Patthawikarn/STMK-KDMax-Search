// Logout
document.querySelector('.btn-outline-danger').addEventListener('click', () => {
    window.location.href = './index.html';
});

// home
document.querySelector('.btn-outline-primary').addEventListener('click', () => {
    window.location.href = './main.html';
});

// เก็บค่าที่เลือกจาก dropdown
let selectedDropdownValues = [];

// Dropdown
const dropdowns = document.querySelectorAll('.dropdown-menu');

dropdowns.forEach(dropdown => {
    dropdown.addEventListener('click', (e) => {
        const selectedText = e.target.textContent.trim();
        const searchInput = document.getElementById('searchInput');
        
        if (!selectedDropdownValues.includes(selectedText)) {
            selectedDropdownValues.push(selectedText);
        }

        searchInput.value = selectedDropdownValues.join(', ');
    });
});

// ตัวแปรที่จำเป็นสำหรับค้นหา
function searchCardItems(searchValues) {
    const filteredCards = allCards.filter(card => {
        return searchValues.some(value => 
            card.Desc.toLowerCase().includes(value.toLowerCase()) || 
            card.PreviewPic.toLowerCase().includes(value.toLowerCase())
        );
    });

    totalItems = filteredCards.length;
    totalPages = Math.ceil(totalItems / itemsPerPage);
    currentPage = 1;

    createCardElements(filteredCards.slice(0, itemsPerPage));

    if (filteredCards.length === 0) {
        displayNoResultsMessage();
    } else {
        createPagination();
    }

    // รีเซ็ต dropdown
    selectedDropdownValues = [];
    document.getElementById('searchInput').value = '';
}

// เมื่อกดปุ่มค้นหา
document.getElementById('searchButton').addEventListener('click', () => {
    searchCardItems(selectedDropdownValues);
});

// ดึงข้อมูล Card Items และแสดงผล
window.addEventListener('load', () => {
    fetchCardItems();
});

// องค์ประกอบการ์ด
function createCardElements(cards) {
    const container = document.getElementById('card-container');
    container.innerHTML = '';

    if (cards.length === 0) {
        displayNoResultsMessage();
        return;
    }

    cards.forEach(card => {
        let { PreviewPic, UrlImage, Desc } = card;
        
        PreviewPic = PreviewPic.replace(/\.[^/.]+$/, '');

        const cardElement = `
            <div class="col">
                <div class="card shadow-sm">
                    <img src="${UrlImage}" class="card-img-top" alt="">
                    <div class="card-body">
                        <p class="card-title">${PreviewPic}</p>
                        <p class="card-title-2">${Desc}</p>
                        <div class="d-flex justify-content-between align-items-center">
                           
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', cardElement);
    });
}

// ฟังก์ชันแสดงข้อความ "ไม่พบข้อมูล"
function displayNoResultsMessage() {
    const container = document.getElementById('card-container');
    container.innerHTML = '<p class="text-center">ไม่พบข้อมูล</p>';
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
            filteredCards = cards;
            totalItems = cards.length;
            totalPages = Math.ceil(totalItems / itemsPerPage);

            createCardElements(cards.slice(0, itemsPerPage));
            createPagination();
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            displayNoResultsMessage();
        });
}

// สร้างปุ่มไป-กลับ & เลขหน้า
function createPagination() {
    const paginationContainer = document.getElementById('pagination-container');
    paginationContainer.innerHTML = '';

    const prevButton = document.createElement('li');
    prevButton.classList.add('page-item');
    prevButton.innerHTML = '<a class="page-link" href="#"><i class="fas fa-chevron-left"></i></a>';
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
    nextButton.innerHTML = '<a class="page-link" href="#"><i class="fas fa-chevron-right"></i></a>';
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

    createCardElements(filteredCards.slice(start, end));
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

// จำนวนการ์ดต่อหน้า
const itemsPerPage = 50;
let totalItems = 0;
let totalPages = 0;
let currentPage = 1;
let allCards = [];
let filteredCards = [];

// ปุ่มเลื่อนกลับ
window.addEventListener('scroll', () => {
    const backToTopButton = document.getElementById('back-to-top');
    if (window.scrollY > 100) {
        backToTopButton.style.display = 'block';
    } else {
        backToTopButton.style.display = 'none';
    }
});

// เลื่อนกลับไปด้านบน
document.getElementById('back-to-top').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});


