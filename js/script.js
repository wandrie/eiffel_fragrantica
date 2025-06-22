// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const navLinks = document.getElementById("navLinks");

mobileMenuBtn.addEventListener("click", () => {
  navLinks.classList.toggle("active");
  mobileMenuBtn.innerHTML = navLinks.classList.contains("active")
    ? '<i class="fas fa-times"></i>'
    : '<i class="fas fa-bars"></i>';
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    if (this.getAttribute("href") === "#") return;

    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 80,
        behavior: "smooth",
      });

      // Close mobile menu if open
      if (navLinks.classList.contains("active")) {
        navLinks.classList.remove("active");
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
      }
    }
  });
});

// Cart functionality
let cartItems = [];
const cartCount = document.getElementById("cartCount");
const cartButtonNavbar = document.getElementById("cartButtonNavbar");
const cartModal = document.getElementById("cartModal");
const closeCartModalBtn = document.getElementById("closeCartModal");
const cartModalContent = document.getElementById("cartModalContent");
const cartModalTotal = document.getElementById("cartModalTotal");

// Fungsi untuk menambahkan produk ke keranjang dengan pilihan jumlah
function addToCart(productName, price) {
  let quantity = prompt(`Masukkan jumlah untuk ${productName}:`, "1");

  quantity = parseInt(quantity);
  if (isNaN(quantity) || quantity <= 0) {
    alert("Jumlah tidak valid. Harap masukkan angka positif.");
    return;
  }

  const existingItemIndex = cartItems.findIndex(
    (item) => item.productName === productName
  );

  if (existingItemIndex > -1) {
    cartItems[existingItemIndex].quantity += quantity;
  } else {
    cartItems.push({ productName, price, quantity });
  }
  updateCartCount();
  alert(`${quantity}x ${productName} telah ditambahkan ke keranjang!`);
}

// Fungsi untuk memperbarui jumlah item di ikon keranjang
function updateCartCount() {
  let totalItems = 0;
  cartItems.forEach((item) => {
    totalItems += item.quantity;
  });
  cartCount.textContent = totalItems;
}

// Fungsi untuk merender item di modal keranjang
function renderCartItemsInModal() {
  cartModalContent.innerHTML = ""; // Bersihkan konten sebelumnya
  let total = 0;

  if (cartItems.length === 0) {
    cartModalContent.innerHTML = "<p>Keranjang Anda kosong.</p>";
  } else {
    cartItems.forEach((item, index) => {
      const itemElement = document.createElement("div");
      itemElement.classList.add("cart-item");
      itemElement.innerHTML = `
        <span>${item.productName} (x${item.quantity})</span>
        <span>Rp ${(item.price * item.quantity).toLocaleString("id-ID")}</span>
        <button class="remove-item-btn" data-index="${index}">&times;</button>
      `;
      cartModalContent.appendChild(itemElement);
      total += item.price * item.quantity;
    });

    // event listener untuk tombol hapus
    document.querySelectorAll(".remove-item-btn").forEach((button) => {
      button.addEventListener("click", (e) => {
        const indexToRemove = parseInt(e.target.dataset.index);
        removeItemFromCart(indexToRemove);
      });
    });
  }
  cartModalTotal.textContent = `Rp ${total.toLocaleString("id-ID")}`;
}

// Fungsi untuk menghapus item dari keranjang
function removeItemFromCart(index) {
  cartItems.splice(index, 1);
  updateCartCount();
  renderCartItemsInModal();
}

// Fungsi untuk "Beli Sekarang" dengan pilihan jumlah dan checkout via WhatsApp
function buyNow(productName, price) {
  let quantity = prompt(`Masukkan jumlah untuk ${productName}:`, "1");

  quantity = parseInt(quantity);
  if (isNaN(quantity) || quantity <= 0) {
    alert("Jumlah tidak valid. Harap masukkan angka positif.");
    return;
  }

  const message =
    `Halo Eiffel Fragrantica, saya ingin membeli:\n\n` +
    `Produk: ${productName}\n` +
    `Jumlah: ${quantity}\n` +
    `Harga per unit: Rp ${price.toLocaleString()}\n` +
    `Total Harga: Rp ${(price * quantity).toLocaleString()}\n\n` +
    `Saya ingin memesan sekarang. Bagaimana caranya?`;

  window.location.href = `https://wa.me/6281907918418?text=${encodeURIComponent(
    message
  )}`;
}

// Form submission
document.getElementById("messageForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const formData = new FormData(this);
  const name = formData.get("name");
  const email = formData.get("email");
  const subject = formData.get("subject");
  const message = formData.get("message");

  alert(
    `Terima kasih ${name}, pesan Anda telah terkirim!\nKami akan segera menghubungi Anda melalui email.`
  );

  this.reset();
});

document.addEventListener("DOMContentLoaded", () => {
  // Event listener untuk tombol keranjang di navbar
  if (cartButtonNavbar) {
    cartButtonNavbar.addEventListener("click", (e) => {
      e.preventDefault();
      if (cartModal) {
        cartModal.classList.add("active");
        renderCartItemsInModal();
      }
    });
  }

  // Event listener untuk tombol silang (menutup modal)
  if (closeCartModalBtn) {
    closeCartModalBtn.addEventListener("click", () => {
      if (cartModal) {
        cartModal.classList.remove("active");
      }
    });
  }

  // Menutup modal jika klik di luar area konten modal
  if (cartModal) {
    window.addEventListener("click", (event) => {
      if (event.target === cartModal) {
        cartModal.classList.remove("active");
      }
    });
  }
  // Inisialisasi jumlah keranjang saat halaman dimuat
  updateCartCount();
});
