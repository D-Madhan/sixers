// Availability Logic
function checkTime() {
    const statusText = document.getElementById('status-text');
    const hour = new Date().getHours();
    
    if (hour >= 10 && hour < 23) {
        statusText.innerText = "Available Now";
        statusText.parentElement.style.color = "#60b246";
    } else {
        statusText.innerText = "Currently Closed";
        statusText.parentElement.style.color = "#e23737";
    }
}

// Simple Menu Data
const menu = {
    "Fast Food": [
        { name: "Signature Burger", price: "₹199" },
        { name: "Peri Peri Fries", price: "₹129" }
    ],
    "South Indian": [
        { name: "Masala Dosa", price: "₹120" },
        { name: "Onion Uthappam", price: "₹140" }
    ]
};

// Modal Logic
const modal = document.getElementById('menu-modal');
const closeBtn = document.querySelector('.close-btn');

function openMenu(category) {
    document.getElementById('modal-category').innerText = category;
    const list = document.getElementById('menu-list');
    list.innerHTML = "";
    
    (menu[category] || []).forEach(item => {
        list.innerHTML += `
            <div class="menu-item">
                <div>
                    <strong>${item.name}</strong><br>
                    <small>${item.price}</small>
                </div>
                <button onclick="addToCart()" style="background:var(--primary); color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer">ADD</button>
            </div>`;
    });
    modal.style.display = 'flex';
}

closeBtn.onclick = () => modal.style.display = 'none';
window.onclick = (e) => { if (e.target == modal) modal.style.display = 'none'; };

let count = 0;
function addToCart() {
    count++;
    document.getElementById('cart-count').innerText = count;
}

window.onload = checkTime;

// Service Button Toggles
document.querySelectorAll('.opt-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('.opt-btn.active').classList.remove('active');
        btn.classList.add('active');
    });
});