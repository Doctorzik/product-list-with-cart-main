const fetchData = async () => {
	const response = await fetch("/data.json");
	const productList = await response.json();
	return productList;
};
const cartList = [];
const init = async () => {
	const productList = await fetchData();

	renderProduct(productList);
	const addToCartBtn = document.querySelectorAll(".product-btn");

	window.addEventListener("resize", updateImages);

	addBtnEvenListerner(addToCartBtn);

	renderCart(cartList);
};

document.addEventListener("DOMContentLoaded", init);

function renderProduct(products) {
	const productContainer = document.getElementById("product-container");

	products.forEach((product) => {
		let card = document.createElement("div");
		card.classList.add("product-card");
		card.innerHTML = `
	
	<div class="image-card">
	<img class="img-product" 
	         data-mobile="${product.image.mobile}"
			     data-tablet="${product.image.tablet}"
			     data-desktop="${product.image.desktop}"
	/>
  
	<button class="product-btn"  data-name="${product.name}"><img  src="./assets/images/icon-add-to-cart.svg"/><span>Add to Cart</span></button> 
  	<div   class="math-card"><button class="add">+</button><span class="quantity">1</span><button class="subtract">-</button></div>
	</div>
  <div class="product-text-card">
	<p class="product-category">${product.category}</p>
	<p class="product-name">${product.name}</p>
	<p class="product-price">$${product.price.toFixed(2)}</p>
	<div>
  `;

		productContainer.append(card);
	});

	updateImages();
}

function addBtnEvenListerner(buttons) {
	let cartItem = {};

	buttons.forEach((button) => {
		button.addEventListener("click", (e) => {
			e.preventDefault();
			const card = e.target.closest(".product-card");

			const name = card.querySelector(".product-name").textContent;
			const price = card.querySelector(".product-price").textContent;
			const addToCartBtn = card.querySelector(".product-btn");
			const mathCard = card.querySelector(".math-card");
			const quantitySpan = card.querySelector(".quantity");
			const imageCard = (card.querySelector(".img-product").style.border =
				"2px solid red");

			const imageUrl = new URL(card.querySelector(".img-product").src);
			const imagePath = imageUrl.pathname;
			let existingProduct = cartList.find((item) => item.name === name);

			if (existingProduct) {
				existingProduct.quantity++;
			} else {
				cartItem = {
					name: name,
					price: price,
					quantity: 1,
					image: imagePath,
				};
				addToCartBtn.style.display = "none";
				mathCard.style.display = "flex";
				quantitySpan.textContent = 1;
				cartList.push(cartItem);
			}

			renderCart(cartList);
		});
	});

	const addBtn = document.querySelectorAll(".add");

	addBtn.forEach((btn) => {
		btn.addEventListener("click", (e) => {
			const card = e.target.closest(".product-card");
			const name = card.querySelector(".product-name").textContent;
			const spanContent = card.querySelector(".quantity");

			const cartItemInCart = cartList.find((item) => item.name === name);
			if (cartItemInCart) {
				cartItemInCart.quantity++;
				spanContent.textContent = cartItemInCart.quantity;
				renderCart(cartList);
				if (cartItemInCart.quantity > 5) {
					alert(
						`You have reached the limit of (${cartItemInCart.quantity}) that you can buy for a product`,
					);
					btn.setAttribute("disabled", "");
				}
			}
		});
	});

	const subtractBtn = document.querySelectorAll(".subtract");
	subtractBtn.forEach((btn) => {
		btn.addEventListener("click", (e) => {
			const card = e.target.closest(".product-card");

			const name = card.querySelector(".product-name").textContent;
			const spanContent = card.querySelector(".quantity");
			const addToCartBtn = card.querySelector(".product-btn");
			const mathCard = card.querySelector(".math-card");
			const item = cartList.find((item) => item.name === name);

			if (item && item.quantity > 1) {
				item.quantity--;
				spanContent.textContent = item.quantity;
			} else {
				cartList.pop(item);
				addToCartBtn.style.display = "flex";
				mathCard.style.display = "none";
				card.querySelector(".img-product").style.border = "";
			}
			renderCart(cartList);
		});
	});
}

function mediaSize(media) {
	if (media <= 425) {
		return "mobile";
	} else if (media > 425 && media <= 768) {
		return "tablet";
	} else {
		return "desktop";
	}
}

function updateImages() {
	const images = document.querySelectorAll(".img-product");
	const size = mediaSize(window.innerWidth);
	images.forEach((img) => {
		if (size === "mobile") {
			img.src = img.dataset.mobile;
		} else if (size === "tablet") {
			img.src = img.dataset.tablet;
		} else {
			img.src = img.dataset.desktop;
		}
	});
}

function renderCart(cartItemm) {
	const cartCard = document.querySelector("#cart-card");

	let total = 0;

	const memm = cartItemm.map((items) => {
		return Number(items.price.slice(1)) * items.quantity;
	});
	let totalOrder = 0;
	totalOrder = memm.reduce((cur, index) => cur + index, totalOrder);

	for (let i = 0; i < cartItemm.length; ++i) {
		total = total + cartItemm[i].quantity;
	}

	const cartHeading = document.createElement("h2");
	cartCard.innerHTML = ` <h2>Your Cart (${total})</h2>
	    <div>
	  ${
			cartItemm.length === 0
				? `<img  src="./assets/images/illustration-empty-cart.svg"/>
				   <p class="empty-cart-p">Your added items will appear hear</p>
				`
				: `${cartItemm.map(
						(item) => `
					<div class="cart-details-card">
					<h4>${item.name}</h4>
					<div class="details-container">
					<p>${item.quantity}X</p>
					<div class="p-q">
					<p>@${item.price}</p>
					<p>@$${Number(item.price.slice(1)) * item.quantity}</p>
					</div>
					</div>
					<button data-name="${item.name}" class="cart-btn" >X</button>
					</div>
					<hr>
					`,
					)}
					<div class="total"><p>Order Total</p> <p class="total-order">$${totalOrder}</p></div>
					<button id="confirm-order-btn"  class="confirm-order">Confirm Order</button>
					`
		}
		
		</div>


	`;

	cartCard.append(cartHeading);

	const buttons = document.querySelectorAll(".cart-btn");
	buttons.forEach((btn) => {
		btn.addEventListener("click", (e) => {
			const name = e.target.dataset.name;
			const itemIndex = cartList.findIndex((item) => item.name === name);
			if (itemIndex !== -1) {
				cartList.splice(itemIndex, 1);
			}

			const productCards = document.querySelectorAll(".product-card");
			productCards.forEach((card) => {
				const productName = card.querySelector(".product-name").textContent;
				if (productName === name) {
					card.querySelector(".product-btn").style.display = "flex";
					card.querySelector(".math-card").style.display = "none";
					card.querySelector(".quantity").textContent = "1";
					const imageCard = (card.querySelector(".img-product").style.border =
						"");
				}
			});

			renderCart(cartList);
		});
	});

	const confirmOrder = document.querySelector("#confirm-order-btn");

	if (confirmOrder)
		confirmOrder.addEventListener("click", () => {
			const dialogElement = document.createElement("dialog");

			dialogElement.innerHTML = `
						 <div>
						    <img class="checkmark"  src="./assets/images/icon-order-confirmed.svg" />
								<h2 class="confirm-heading">Order Confirmed</h2>
						     <p>We hope you enjoy your food!</p>
						     <div>
								 ${cartItemm
										.map(
											(item) =>
												`

										 	<div class="cart-details-card">
				                 <h4>${item.name}</h4>
				                 <div class="details-container">
				                   <img width="40px" height="40px" src="${item.image}" />
			                    	<p>${item.quantity}X</p>
			                  	  <div class="p-q">
		                  	   	<p>@${item.price}</p>
			                     	<p>@$${Number(item.price.slice(1)) * item.quantity}</p>
		              	      	</div>
			              	   </div>
		   
			             	</div>

			            	<hr>
             
										`,
										)
										.join("")}
                <p class="total"><span>Order Total: </span> <span  class="total-order">${totalOrder}</span></p>
					  			<button id="close-modal"  class="confirm-order">Start New Order</button>
								</div>

						`;

			document.body.append(dialogElement);
			dialogElement.showModal();
			const closeModalBtn = dialogElement.querySelector("#close-modal");

			closeModalBtn.addEventListener("click", () => {
				dialogElement.close();

				cartItemm.length = 0;
				const productCards = document.querySelectorAll(".product-card");
				productCards.forEach((card) => {
					card.querySelector(".product-btn").style.display = "flex";
					card.querySelector(".math-card").style.display = "none";
					card.querySelector(".quantity").textContent = "1";
					card.querySelector(".img-product").style.border = "";
				});
				console.log(cartList);
				console.log(cartItemm);
				renderCart(cartList);
			});
		});
}
