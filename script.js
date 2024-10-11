"use strict"


// When the user clicks on the button, scroll to the top of the document
function topFunction() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}



 /*Dark and light mode toggle*/
document.getElementById('toggleMode').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    this.innerHTML = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
});

/* Cart functionality */
const cart = document.getElementById('cart');
const totalCount = document.getElementById('totalCount');
const tax = document.getElementById('tax');
const shipping = document.getElementById('shipping');
const emptyCart = document.createElement('p');
emptyCart.id = 'emptyPlaceholder';
emptyCart.innerText = 'Your cart is empty.';

const shippingCost = 5.00;
const taxRate = 0.1;

const shoppingCart = [];

/**
 * Add products to the cart
 */
function addToCart(productId) {
    const emptyPlaceholder = document.getElementById('emptyPlaceholder');
    if (emptyPlaceholder) emptyPlaceholder.remove();

    const product = products[productId];

    const cartItem = document.createElement('article');
    cartItem.classList.add('cart-item');

    const productImage = document.createElement('img');
    productImage.src = product.image;
    productImage.alt = product.name;

    const productInfo = document.createElement('section');
    const productName = document.createElement('h3');
    productName.innerText = product.name;
    const productDescription = document.createElement('p');
    productDescription.innerText = product.description;
    productInfo.appendChild(productName);
    productInfo.appendChild(productDescription);

    const productPrice = document.createElement('p');
    productPrice.classList.add('cart-price');
    productPrice.innerText = `$${product.price}`;

    const removeButton = document.createElement('button');
    removeButton.classList.add('button1', 'remove-btn');
    removeButton.innerText = 'X';
    removeButton.addEventListener('click', () => {
        cartItem.remove();
        updateTotal(-product.price);
        if (cart.children.length === 0) cart.appendChild(emptyCart);
    });

    cartItem.appendChild(productImage);
    cartItem.appendChild(productInfo);
    cartItem.appendChild(productPrice);
    cartItem.appendChild(removeButton);

    cart.appendChild(cartItem);
    shoppingCart.push(product);
    updateTotals();
}

/**
 * Update the cart total display
 */
function updateTotal(priceChange) {
    const currentTotal = parseFloat(totalCount.innerText) || 0;
    totalCount.innerText = (currentTotal + priceChange).toFixed(2);
}

/**
 * Update the total, tax, and shipping
 */
function updateTotals() {
    const totals = shoppingCart.reduce((acc, item) => {
        acc.total += item.price;
        acc.tax = acc.total * taxRate;
        acc.shipping = acc.total > 0 ? shippingCost : 0;
        return acc;
    }, { total: 0, tax: 0, shipping: 0 });

    totalCount.innerText = (totals.total + totals.tax + totals.shipping).toFixed(2);
    tax.innerText = `Tax Rate - $${totals.tax.toFixed(2)}`;
    shipping.innerText = `Shipping Rate - $${totals.shipping.toFixed(2)}`;
}

/*Checkout functionality*/
const checkoutButton = document.getElementById('checkout');
checkoutButton.addEventListener('click', () => {
    if (shoppingCart.length > 0) {
        showToast(`Thank you for your purchase of ${shoppingCart.length} item${shoppingCart.length > 1 ? 's' : ''} for $${totalCount.innerText}!`);
        cart.innerHTML = '';
        totalCount.innerText = '0.00';
        tax.innerText = '';
        shipping.innerText = '';
        shoppingCart.length = 0;
        cart.appendChild(emptyCart);
    } else {
        showToast('Your cart is empty. Please add items to your cart.', { variant: 'error' });
    }
});

/*List of available products*/
const products = [
    { name: 'Coconut Body Butter', description: "Sweet and rich coconut body butter", price: 35, image: 'images/bodybutter.jpeg' },
    { name: 'Lavender Hand Cream', description: 'Lavender Hand Cream that is guaranteed to relax your senses', price: 25, image: 'images/handlotion.jpeg' },
    { name: 'Lip Balm', description: "Floral Lip Balm for an instant lip revive", price: 10, image: 'images/lipbalm.jpeg' },
    { name: 'Moisturizer', description: "Moisturizer made from Jojoba Oils, Squalene, and Chamomille", price: 50, image: 'images/moisturizer.jpeg' },
    { name: 'Lavender Anti-Aging Serum', description: "Lavender Anti-Aging Serum that can reverse time", price: 45, image: 'images/serum.jpeg' },
    { name: 'Mint Toner', description: "Mint Toner to refresh and replenish thirsty skin", price: 25, image: 'images/toner.jpeg' },
];

const productContainer = document.getElementById('products');

/*Display products*/
products.forEach(product => {
    const productDiv = document.createElement('article');
    productDiv.classList.add('product');

    const productImage = document.createElement('img');
    productImage.src = product.image;
    productImage.alt = product.name;

    const productName = document.createElement('h3');
    productName.innerText = product.name;

    const productDescription = document.createElement('p');
    productDescription.innerText = product.description;

    const productPrice = document.createElement('p');
    productPrice.innerText = `$${product.price}`;

    const addToCartButton = document.createElement('button');
    addToCartButton.classList.add('button1');
    addToCartButton.innerText = 'Add to Cart';
    addToCartButton.addEventListener('click', () => {
        addToCart(products.indexOf(product));
        updateTotals();
        showToast(`${product.name} added to cart!`);
    });

    productDiv.appendChild(productImage);
    productDiv.appendChild(productName);
    productDiv.appendChild(productDescription);
    productDiv.appendChild(productPrice);
    productDiv.appendChild(addToCartButton);

    productContainer.appendChild(productDiv);
});

/* Show toast message*/
function showToast(message, { variant = 'success' } = {}) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;

    if (variant === 'error') {
        toast.classList.add('toast-error');
    }

    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        toast.classList.add('hide');
        setTimeout(() => toast.remove(), 500);
    }, 5000);
}


/* Handle form submission*/
const form = document.getElementById('contactForm');
const firstNameInput = document.getElementById('firstName');
const lastNameInput = document.getElementById('lastName');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const commentsInput = document.getElementById('comments');
const contactMethod = document.getElementsByName('contactMethod');
const formMessage = document.getElementById('formMessage');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    formMessage.innerText = '';

    // Check if the form is valid
    if (validateForm()) {
        const customer = {
            name: `${firstNameInput.value} ${lastNameInput.value}`,
            email: emailInput.value,
            phone: phoneInput.value,
            comments: commentsInput.value,
            contactMethod: getContactMethod()
        };

        form.reset();
        showToast(`${JSON.stringify(customer, null, 2)}`)
    }
});

/**
 * Validate the form
 */
function validateForm() {
    let isValid = true;

    if (firstNameInput.value === '') {
        showError(firstNameInput, 'First name is required');
        isValid = false;
    } else {
        removeError(firstNameInput);
    }

    if (lastNameInput.value === '') {
        showError(lastNameInput, 'Last name is required');
        isValid = false;
    } else {
        removeError(lastNameInput);
    }

    if (emailInput.value === '' && contactMethod[0].checked) {
        showError(emailInput, 'Email is required');
        isValid = false;
    } else if (!validateEmail(emailInput.value) && contactMethod[0].checked) {
        showError(emailInput, 'Please enter a valid email address');
        isValid = false;
    } else {
        removeError(emailInput);
    }

    if (phoneInput.value === '' && contactMethod[1].checked) {
        showError(phoneInput, 'Phone number is required');
        isValid = false;
    } else if (!validatePhone(phoneInput.value) && contactMethod[1].checked) {
        showError(phoneInput, 'Please enter a valid phone number');
        isValid = false;
    } else {
        removeError(phoneInput);
    }

    if (commentsInput.value === '') {
        showError(commentsInput, 'Comments are required');
        isValid = false;
    } else {
        removeError(commentsInput);
    }

    if (!getContactMethod()) {
        showToast('Please select a contact method', { variant: 'error' });
        isValid = false;
    }

    return isValid;
}

/* Validate email address*/
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/* Validate phone number*/
function validatePhone(phone) {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
}

/*Show error message*/
function showError(input, message) {
    const error = document.createElement('p');
    error.className = 'error';
    error.innerText = message;

    const inputContainer = input.parentElement;
    const existingError = inputContainer.querySelector('.error');
    if (existingError) {
        existingError.remove();
    }
    inputContainer.appendChild(error);
}

/* Remove error message*/
function removeError(input) {
    const inputContainer = input.parentElement;
    const error = inputContainer.querySelector('.error');
    if (error) {
        error.remove();
    }
}

/* Get the selected contact method */
function getContactMethod() {
    let selectedMethod;

    contactMethod.forEach(method => {
        if (method.checked) {
            selectedMethod = method.value;
        }
    });

    return selectedMethod;
}