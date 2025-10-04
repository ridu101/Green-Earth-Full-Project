// ---------------------- Spinner ----------------------
const manageSpinner = (status) => {
    const spinnerSection = document.getElementById("spinner-section");
    const cardContainer = document.getElementById("card-container");
    if (status) {
        spinnerSection.classList.remove("hidden");
        cardContainer.classList.add("hidden");
    } else {
        spinnerSection.classList.add("hidden");
        cardContainer.classList.remove("hidden");
    }
};

// ---------------------- Hamburger ----------------------
const hamburgerBtn = document.getElementById("hamburger-btn");
const mobileMenu = document.getElementById("mobile-menu");
hamburgerBtn.addEventListener("click", () => mobileMenu.classList.toggle("hidden"));

// ---------------------- Categories ----------------------
const removeActiveButton = () => {
    document.querySelectorAll(".category-btn").forEach(btn => btn.classList.remove("active"));
};

const loadCategories = async () => {
    try {
        const res = await fetch("https://openapi.programming-hero.com/api/categories");
        const data = await res.json();
        displayCategories(data.categories);
    } catch (err) {
        console.error(err);
    }
};

const displayCategories = (categories) => {
    const container = document.getElementById("category-container");
    container.innerHTML = "";
    categories.forEach(category => {
        const div = document.createElement("div");
        div.innerHTML = `
            <section class="w-full flex justify-center">
                <div class="flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap">
                    <button id="category-btn-${category.id}" onclick="loadSpecificTrees(${category.id})"
                        class="category-btn w-[200px] h-[30px] hover:bg-green-700 hover:text-white transform transition duration-300 hover:-translate-y-1 items-center flex p-2 rounded-md">
                        ${category.category_name}
                    </button>
                </div>
            </section>`;
        container.appendChild(div);
    });
};

loadCategories();

// ---------------------- Cards ----------------------
const loadCards = async () => {
    manageSpinner(true);
    try {
        const res = await fetch("https://openapi.programming-hero.com/api/plants");
        const data = await res.json();
        displayCards(data.plants);
    } catch (err) {
        console.error(err);
        document.getElementById("card-container").innerHTML = "<p class='text-center text-red-500'>Failed to load plants</p>";
    }
    manageSpinner(false);
};

const displayCards = (cards) => {
    const container = document.getElementById("card-container");
    container.innerHTML = "";
    if (!cards || cards.length === 0) {
        container.innerHTML = "<p class='text-center text-red-500'>No plants found.</p>";
        return;
    }

    cards.forEach(card => {
        const div = document.createElement("div");
        div.innerHTML = `
            <div class="lg:w-[280px] h-[360px] p-5 rounded-xl space-y-3 bg-white shadow-md hover:bg-green-100 hover:shadow-xl transition duration-300 hover:-translate-y-2 relative">
                <div class="relative w-full h-[120px]">
                    <img class="w-full h-full object-cover rounded-xl" src="${card.image}" alt="image load failed">
                    <button class="absolute top-2 right-2 text-black bg-white text-sm rounded-full p-1 shadow-md info-btn" title="More Info">
                        <i class="fa-solid fa-circle-info"></i>
                    </button>
                </div>
                <h1 class="font-bold text-lg">${card.name}</h1>
                <p class="text-gray-500 text-sm line-clamp-2">${card.description}</p>
                <div class="flex justify-between items-center">
                    <p class="px-3 py-1 bg-[#dcfce7] text-[#15803d] rounded-2xl font-medium">${card.category}</p>
                    <p class="font-semibold"><i class="fa-solid fa-bangladeshi-taka-sign"></i> ${card.price}</p>
                </div>
                <button class="add-to-cart-btn w-full bg-green-600 text-white py-1 rounded-md hover:bg-green-700">Add to Cart</button>
            </div>`;
        
        // Info modal
        div.querySelector(".info-btn").addEventListener("click", async () => {
            try {
                const res = await fetch(`https://openapi.programming-hero.com/api/plant/${card.id}`);
                const data = await res.json();
                if (data.status && data.plants) {
                    const plant = data.plants;
                    document.getElementById("modal-plant-name").textContent = plant.name;
                    document.getElementById("modal-plant-description").textContent = plant.description;
                    document.getElementById("modal-plant-category").textContent = "Category: " + plant.category;
                    document.getElementById("modal-plant-price").innerHTML = `Price: <i class="fa-solid fa-bangladeshi-taka-sign"></i> ${plant.price}`;
                    document.getElementById("plant_info_modal").showModal();
                } else alert("Failed to fetch plant data!");
            } catch (err) {
                console.error(err);
                alert("Error fetching plant info.");
            }
        });

        // Add to cart
        div.querySelector(".add-to-cart-btn").addEventListener("click", () => {
            document.getElementById("my_modal_5").showModal();
            addToCart(card);
        });

        container.appendChild(div);
    });
};

loadCards();

// ---------------------- Specific Trees ----------------------
const loadSpecificTrees = async (id) => {
    manageSpinner(true);
    try {
        const res = await fetch(`https://openapi.programming-hero.com/api/category/${id}`);
        const data = await res.json();
        removeActiveButton();
        document.getElementById(`category-btn-${id}`).classList.add("active");
        displayCards(data.plants);
    } catch (err) {
        console.error(err);
    }
    manageSpinner(false);
};

// ---------------------- Cart ----------------------
let totalPrice = 0;

const addToCart = (card) => {
    const cartContainer = document.getElementById("cart-items");
    const totalElem = document.querySelector("#cart-total .total-price");
    let currentTotal = parseInt(totalElem.textContent);

    let existing = cartContainer.querySelector(`[data-id='${card.id}']`);
    if (existing) {
        let qtyElem = existing.querySelector(".qty");
        let qty = parseInt(qtyElem.textContent) + 1;
        qtyElem.textContent = qty;
        existing.querySelector(".item-price").textContent = card.price * qty;
        currentTotal += card.price;
        totalElem.textContent = currentTotal;
        adjustCartHeight();
        return;
    }

    const item = document.createElement("div");
    item.className = "flex justify-between items-center bg-[#f0fdf4] p-4 rounded-xl";
    item.dataset.id = card.id;
    item.innerHTML = `
        <div>
            <h1 class="font-bold">${card.name}</h1>
            <p><i class="fa-solid fa-bangladeshi-taka-sign"></i> <span class="item-price">${card.price}</span> x <span class="qty">1</span></p>
        </div>
        <button class="text-red-600 remove-btn">
            <i class="fa-solid fa-xmark"></i>
            <span class="sr-only">Remove</span>
        </button>`;
    
    item.querySelector(".remove-btn").addEventListener("click", () => {
        const qty = parseInt(item.querySelector(".qty").textContent);
        const price = card.price * qty;
        currentTotal -= price;
        totalElem.textContent = currentTotal;
        item.remove();
        adjustCartHeight();
    });

    cartContainer.appendChild(item);
    currentTotal += card.price;
    totalElem.textContent = currentTotal;
    adjustCartHeight();
};

// ---------------------- Cart Height ----------------------
const adjustCartHeight = () => {
    const cart = document.getElementById("add-cart-container");
    const items = document.getElementById("cart-items");
    const newHeight = items.scrollHeight + 100; // 100 for padding + total
    cart.style.height = newHeight > 480 ? newHeight + "px" : "480px";
};
