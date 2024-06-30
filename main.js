// Logout
document.querySelector('.btn-outline-danger').addEventListener('click', () => {
    window.location.href = './index.html';
});

// กำหนดตัวแปรที่จำเป็นสำหรับการค้นหา
const searchInput = document.getElementById('searchInput');

// ฟังก์ชันค้นหา Card Items
function searchCardItems(searchValue) {
    const filteredCards = allCards.filter(card => {
        return card.Desc.toLowerCase().includes(searchValue); // กรองตามคำค้นหาที่ตรงกับ "Desc" property
    });

    totalItems = filteredCards.length;
    totalPages = Math.ceil(totalItems / itemsPerPage);
    currentPage = 1;

    createCardElements(filteredCards.slice(0, itemsPerPage));
    createPagination();
}

// เมื่อกดปุ่มค้นหา
document.getElementById('searchButton').addEventListener('click', () => {
    const searchValue = searchInput.value.trim().toLowerCase();
    searchCardItems(searchValue);
});

// เมื่อพิมพ์ในช่องค้นหา
searchInput.addEventListener('input', () => {
    const searchValue = searchInput.value.trim().toLowerCase();
    searchCardItems(searchValue);
});

// เมื่อโหลดเสร็จให้ดึงข้อมูล Card Items และแสดงผล
window.addEventListener('load', () => {
    fetchCardItems(); // ดึงข้อมูล Card Items จาก API

    // สร้างการค้นหาตามที่ป้อนเข้า
    searchInput.addEventListener('input', () => {
        const searchValue = searchInput.value.trim().toLowerCase();
        searchCardItems(searchValue);
    });
});


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
                                <button type="button" class="btn btn-sm btn-outline-secondary" onclick="downloadImage('${UrlImage}')">โหลด</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', cardElement);
    });

    if (cards.length === 0) {
        displayNoResultsMessage();
    }
}

// ฟังก์ชันสำหรับการดาวน์โหลดภาพ
function downloadImage(url) {
    const link = document.createElement('a');
    link.href = url;
    link.download = url.split('/').pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

// เมื่อโหลดเสร็จให้เรียกฟังก์ชัน fetchCardItems
window.addEventListener('load', () => {
    fetchCardItems();

    dropdown.addEventListener('change', () => {
        filterCardItems(dropdown.value, searchInput.value.trim().toLowerCase());
    });

    searchInput.addEventListener('input', () => {
        searchCardItems(dropdown.value, searchInput.value.trim().toLowerCase());
    });
});

// สร้างปุ่มไป-กลับ & เลขหน้า
function createPagination() {
    const paginationContainer = document.getElementById('pagination-container');
    paginationContainer.innerHTML = '';

    const prevButton = document.createElement('li');
    prevButton.classList.add('page-item');
    prevButton.innerHTML = '<a class="page-link" href="#">ก่อนหน้า</a>';
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
    nextButton.innerHTML = '<a class="page-link" href="#">ถัดไป</a>';
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

// แสดงปุ่มเมื่อเลื่อนลงมาเกิน 100px
window.addEventListener('scroll', () => {
    const backToTopButton = document.getElementById('back-to-top');
    if (window.scrollY > 100) {
        backToTopButton.style.display = 'block';
    } else {
        backToTopButton.style.display = 'none';
    }
});

// เลื่อนกลับไปด้านบนเมื่อปุ่มถูกกด
document.getElementById('back-to-top').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});