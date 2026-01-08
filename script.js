// 1. GLOBAL VARIABLES
let cartItems = [];
const menuModal = document.getElementById('menu-modal');
const cartModal = document.getElementById('cart-overlay');

// 2. AVAILABILITY LOGIC
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

// 3. FULL MENU DATA
const menu = {
    "Fast Food": [
        { name: "Signature Burger", price: "₹199" },
        { name: "Peri Peri Fries", price: "₹129" },
        { name: "Veg Cheese Sandwich", price: "₹149" }
    ],
    "South Indian": [
        { name: "Masala Dosa", price: "₹120" },
        { name: "Onion Uthappam", price: "₹140" },
        { name: "Idli Sambar (2pcs)", price: "₹80" }
    ],
    "Chinese": [
        { name: "Schezwan Noodles", price: "₹180" },
        { name: "Veg Manchurian", price: "₹160" },
        { name: "Chilli Paneer", price: "₹210" }
    ],
    "North Indian": [
        { name: "Paneer Butter Masala", price: "₹240" },
        { name: "Dal Makhani", price: "₹210" },
        { name: "Butter Naan", price: "₹50" }
    ],
    "Desserts": [
        { name: "Gulab Jamun (2pcs)", price: "₹80" },
        { name: "Chocolate Brownie", price: "₹150" },
        { name: "Vanilla Ice Cream", price: "₹60" }
    ],
    "Beverages": [
        { name: "Masala Chai", price: "₹40" },
        { name: "Fresh Lime Soda", price: "₹90" },
        { name: "Cold Coffee", price: "₹120" }
    ]
};

// 4. DROPDOWN TOGGLE
function toggleDropdown(event) {
    event.stopPropagation();
    document.getElementById("side-dropdown").classList.toggle("show");
}

// 5. MODAL LOGIC (OPEN MENU)
function openMenu(category) {
    const modalTitle = document.getElementById('modal-category');
    const list = document.getElementById('menu-list');

    modalTitle.innerText = category;
    list.innerHTML = "";

    const items = menu[category];

    if (items) {
        items.forEach(item => {
            list.innerHTML += `
                <div class="menu-item">
                    <div>
                        <strong>${item.name}</strong><br>
                        <small>${item.price}</small>
                    </div>
                    <button onclick="addToCart('${item.name}', '${item.price}')" 
                        style="background:var(--primary); color:white; border:none; padding:8px 15px; border-radius:4px; cursor:pointer; font-weight:600;">
                        ADD
                    </button>
                </div>`;
        });
    }
    menuModal.style.display = 'flex';
}

// 6. UPDATED CART LOGIC
function addToCart(name, price) {
    const existingItem = cartItems.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cartItems.push({
            name: name,
            price: price,
            quantity: 1
        });
    }

    const cartCount = document.getElementById('cart-count');
    const totalQty = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.innerText = totalQty;

    cartCount.style.transform = "scale(1.5)";
    setTimeout(() => { cartCount.style.transform = "scale(1)"; }, 200);
}

function openCart() {
    const list = document.getElementById('cart-items-list');
    const footer = document.getElementById('cart-footer');
    list.innerHTML = "";
    let total = 0;

    if (cartItems.length === 0) {
        list.innerHTML = "<p style='text-align:center; padding:20px; color:#686b78;'>Your cart is empty.</p>";
        footer.innerHTML = "";
    } else {
        cartItems.forEach((item, index) => {
            const priceVal = parseInt(item.price.replace('₹', ''));
            const subtotal = priceVal * item.quantity;
            total += subtotal;

            list.innerHTML += `
                <div class="menu-item" style="align-items: center;">
                    <div style="flex: 1;">
                        <strong>${item.name}</strong><br>
                        <small>${item.price} x ${item.quantity}</small>
                    </div>
                    
                    <div class="qty-controls" style="display: flex; align-items: center; gap: 10px; margin-right: 15px;">
                        <button onclick="updateQuantity(${index}, -1)" class="qty-btn">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity(${index}, 1)" class="qty-btn">+</button>
                    </div>

                    <button onclick="removeItem(${index})" style="background:none; border:none; color:#e23737; cursor:pointer; font-size: 1.2rem;">
                        &times;
                    </button>
                </div>`;
        });

        footer.innerHTML = `
            <div style="font-size: 1.2rem; margin-bottom:15px; font-weight:800; display:flex; justify-content:space-between;">
                <span>Total Amount:</span>
                <span>₹${total}</span>
            </div>
            <div style="display: flex; gap: 10px;">
                <button onclick="clearCart()" style="flex: 1; background:#eee; color:#282c3f; border:none; padding:12px; border-radius:8px; font-weight:700; cursor:pointer;">
                    CANCEL ALL
                </button>
                <button onclick="processCheckout()" class="checkout-btn" style="flex: 2; background:#60b246; padding:12px; color:white; border:none; border-radius:8px; font-weight:700; cursor:pointer;">
                    CHECKOUT
                </button>
            </div>`;
    }
    cartModal.style.display = 'flex';
}

// 7. HELPER FUNCTIONS
function updateQuantity(index, change) {
    cartItems[index].quantity += change;

    if (cartItems[index].quantity <= 0) {
        removeItem(index);
    } else {
        const totalQty = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        document.getElementById('cart-count').innerText = totalQty;
        openCart();
    }
}

function removeItem(index) {
    cartItems.splice(index, 1);
    const totalQty = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').innerText = totalQty;
    openCart();
}

function clearCart() {
    if (confirm("Are you sure you want to clear your cart?")) {
        cartItems = [];
        document.getElementById('cart-count').innerText = "0";
        openCart();
    }
}

// NEW: CHECKOUT FUNCTION
function processCheckout() {
    if (cartItems.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    // Display the thank you message
    alert("Thank you for ordering with Sixers! Your delicious veg meal is being prepared.");

    // Clear the cart data
    cartItems = [];

    // Update the UI
    document.getElementById('cart-count').innerText = "0";
    closeCart();
}

// 8. CLOSE FUNCTIONS
function closeCart() {
    cartModal.style.display = 'none';
}

// 9. GLOBAL CLICK & INITIALIZATION
window.onclick = function (event) {
    const dropdown = document.getElementById("side-dropdown");
    if (dropdown && !event.target.closest('.dropdown')) {
        dropdown.classList.remove("show");
    }

    if (event.target == menuModal) {
        menuModal.style.display = "none";
    }
    if (event.target == cartModal) {
        cartModal.style.display = "none";
    }
};

document.querySelector('#menu-modal .close-btn').onclick = function () {
    menuModal.style.display = 'none';
};

window.onload = checkTime;

document.querySelectorAll('.opt-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('.opt-btn.active').classList.remove('active');
        btn.classList.add('active');
    });
});
