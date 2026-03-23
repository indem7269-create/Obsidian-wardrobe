const CURRENCY_SYMBOL = String.fromCharCode(8358);

const PRODUCT_CATALOG = {
  "Obsidian Tailored Suit": {
    price: `${CURRENCY_SYMBOL}485,000`,
    description: "A sharp formal suit built for ceremonies, boardrooms, and standout evenings.",
  },
  "Midnight Casual Jacket": {
    price: `${CURRENCY_SYMBOL}145,000`,
    description: "A polished casual layer that works for dinner dates, weekend outings, and smart styling.",
  },
  "Eclipse Cotton Shirt": {
    price: `${CURRENCY_SYMBOL}30,000`,
    description: "A lightweight premium cotton shirt designed for clean everyday styling and comfort.",
  },
  "Noir Urban Hoodie": {
    price: `${CURRENCY_SYMBOL}38,000`,
    description: "A minimal hoodie with a relaxed streetwear edge for off-duty looks.",
  },
  "Slate Signature Trousers": {
    price: `${CURRENCY_SYMBOL}32,000`,
    description: "Tailored trousers with a refined silhouette for smart casual and semi-formal looks.",
  },
  "Ivory Classic Shirt": {
    price: `${CURRENCY_SYMBOL}28,000`,
    description: "A versatile classic shirt with a crisp finish that pairs easily with suits or chinos.",
  },
  "Pattern Signature Shirt": {
    price: `${CURRENCY_SYMBOL}35,000`,
    description: "A statement shirt with a bold pattern for dressy casual looks that need personality.",
  },
};

let productModal;

function toggleWishlist(btn) {
  btn.classList.toggle("active");
  btn.innerHTML = btn.classList.contains("active") ? "&#9829;" : "&#9825;";
  updateWishlistCount();
}

function updateWishlistCount() {
  const activeWishlistButtons = document.querySelectorAll(".wishlist-btn.active");
  const wishlistCount = document.getElementById("wishlist-count");

  if (wishlistCount) {
    wishlistCount.textContent = activeWishlistButtons.length;
  }
}

function createProductModal() {
  if (document.querySelector(".product-modal")) {
    productModal = document.querySelector(".product-modal");
    return;
  }

  const modalMarkup = `
    <div class="product-modal" aria-hidden="true">
      <div class="product-modal-overlay" data-close-modal></div>
      <div class="product-modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-product-title">
        <button class="modal-close-btn" type="button" aria-label="Close product details" data-close-modal>&times;</button>
        <div class="product-modal-content">
          <div class="product-modal-image-box">
            <img class="product-modal-image" src="" alt="" />
          </div>
          <div class="product-modal-info">
            <p class="modal-label">Obsidian Wardrobe</p>
            <h2 id="modal-product-title"></h2>
            <p class="modal-price"></p>
            <p class="modal-description"></p>
            <button class="modal-cart-btn" type="button">Add to Cart</button>
            <p class="modal-feedback" aria-live="polite"></p>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalMarkup);
  productModal = document.querySelector(".product-modal");

  productModal.addEventListener("click", event => {
    if (event.target.hasAttribute("data-close-modal")) {
      closeProductModal();
    }
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && productModal.classList.contains("is-open")) {
      closeProductModal();
    }
  });
}

function getCardProductName(card) {
  const heading = card ? card.querySelector("h3") : null;
  return heading ? heading.textContent.trim() : "";
}

function getCardDescription(card) {
  if (!card) {
    return "";
  }

  const paragraphs = Array.from(card.querySelectorAll("p"));
  const descriptiveParagraph = paragraphs.find(paragraph => !/^\D*\d[\d,]*$/.test(paragraph.textContent.trim()));
  return descriptiveParagraph ? descriptiveParagraph.textContent.trim() : "";
}

function getCardPrice(card) {
  if (!card) {
    return "";
  }

  const paragraphs = Array.from(card.querySelectorAll("p"));
  const priceParagraph = paragraphs.find(paragraph => /^\D*\d[\d,]*$/.test(paragraph.textContent.trim()));
  return priceParagraph ? priceParagraph.textContent.trim() : "";
}

function getProductDetails(productName, card) {
  const catalogEntry = PRODUCT_CATALOG[productName] || {};
  const image = card ? card.querySelector("img") : null;

  return {
    name: productName,
    price: catalogEntry.price || getCardPrice(card) || "Price available on request",
    description:
      catalogEntry.description ||
      getCardDescription(card) ||
      "A premium menswear piece from the Obsidian Wardrobe collection.",
    imageSrc: image ? image.getAttribute("src") : "",
    imageAlt: image ? image.getAttribute("alt") : productName,
  };
}

function openProductModal(productDetails) {
  if (!productModal) {
    createProductModal();
  }

  productModal.querySelector("#modal-product-title").textContent = productDetails.name;
  productModal.querySelector(".modal-price").textContent = productDetails.price;
  productModal.querySelector(".modal-description").textContent = productDetails.description;
  productModal.querySelector(".product-modal-image").src = productDetails.imageSrc;
  productModal.querySelector(".product-modal-image").alt = productDetails.imageAlt;
  productModal.querySelector(".modal-feedback").textContent = "";

  const addToCartButton = productModal.querySelector(".modal-cart-btn");
  addToCartButton.onclick = function () {
    productModal.querySelector(".modal-feedback").textContent =
      productDetails.name + " added to cart.";
  };

  productModal.classList.add("is-open");
  productModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeProductModal() {
  if (!productModal) {
    return;
  }

  productModal.classList.remove("is-open");
  productModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

function findCardByProductName(productName) {
  const cards = document.querySelectorAll(".product-card, .featured-card");

  return Array.from(cards).find(card => getCardProductName(card) === productName) || null;
}

function showProduct(productName, card) {
  const activeCard = card || findCardByProductName(productName);

  if (!activeCard) {
    return;
  }

  openProductModal(getProductDetails(productName, activeCard));
}

function setupProductButtons() {
  const productCards = document.querySelectorAll(".product-card, .featured-card");

  productCards.forEach(card => {
    const button = card.querySelector(".view-item-btn");

    if (!button) {
      return;
    }

    button.addEventListener("click", function () {
      showProduct(getCardProductName(card), card);
    });
  });
}

function validateForm() {
  const name = document.getElementById("fullname");
  const email = document.getElementById("email");
  const date = document.getElementById("date");
  const message = document.getElementById("message");

  if (!name || !email || !date || !message) {
    return true;
  }

  if (name.value.trim() === "") {
    alert("Please enter your full name.");
    name.focus();
    return false;
  }

  if (email.value.trim() === "") {
    alert("Please enter your email address.");
    email.focus();
    return false;
  }

  if (!email.value.includes("@") || !email.value.includes(".")) {
    alert("Please enter a valid email address.");
    email.focus();
    return false;
  }

  if (date.value.trim() === "") {
    alert("Please select an appointment date.");
    date.focus();
    return false;
  }

  if (message.value.trim() === "") {
    alert("Please enter your message.");
    message.focus();
    return false;
  }

  alert("Appointment submitted successfully.");
  return true;
}

function setActiveNavLink() {
  const currentPage = window.location.pathname.split("/").pop();
  const navLinks = document.querySelectorAll(".nav-left a, .nav-links a");

  navLinks.forEach(link => {
    const linkPage = link.getAttribute("href");

    if (linkPage === currentPage) {
      link.classList.add("active");
    }
  });
}

function animateHeroContent() {
  const heroContent = document.querySelector(".hero-content");

  if (heroContent) {
    heroContent.style.opacity = "0";
    heroContent.style.transform = "translateY(30px)";

    setTimeout(() => {
      heroContent.style.transition = "all 1s ease";
      heroContent.style.opacity = "1";
      heroContent.style.transform = "translateY(0)";
    }, 200);
  }
}

function revealOnScroll() {
  const cards = document.querySelectorAll(
    ".featured-card, .product-card, .trustee-card, .event-card"
  );

  const windowHeight = window.innerHeight;

  cards.forEach(card => {
    const cardTop = card.getBoundingClientRect().top;

    if (cardTop < windowHeight - 50) {
      card.classList.add("show");
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  createProductModal();
  setupProductButtons();
  setActiveNavLink();
  animateHeroContent();
  updateWishlistCount();
  revealOnScroll();
});

window.addEventListener("scroll", revealOnScroll);
