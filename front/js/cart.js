const myCart = JSON.parse(localStorage.getItem("myCart"));


//Shows a message if the cart is empty
if (myCart == null || myCart.length == 0) {
  document.getElementById("cart__items").innerText += `Votre panier est vide`;

} else {

  //Shows the items in the cart
  function showCart(item, price) {
    return `<article class="cart__item" data-id="${item.id}" data-color="${item.color}">
      <div class="cart__item__img">
        <img src="${item.picture}" alt="${item.pictureTxt}">
      </div>
      <div class="cart__item__content">
        <div class="cart__item__content__description">
          <h2>${item.name}</h2>
          <p>${item.color}</p>
          <p>${price} €</p>
        </div>
        <div class="cart__item__content__settings">
          <div class="cart__item__content__settings__quantity">
            <p>Qté : </p>
            <input data-id= ${item.id} data-color= ${item.color} type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" canapeId="${item.id}" canapeColor="${item.color}"  value="${item.quantity}">
          </div>
          <div class="cart__item__content__settings__delete">
            <p class="deleteItem">Supprimer</p>
          </div>
        </div>
      </div>
    </article>`
  }


  //Get item by productId
  function getItemById(productId) {
    return fetch('http://localhost:3000/api/products/' + productId)
      .then(function(response) {
        return response.json();
      })
  }

  // Gets items from localStorage and adds the price using it's id
  async function getCart() {
    let domUpdated = ''
    for (let items in myCart) {

      let itemAPI = await getItemById(myCart[items].id)
      domUpdated += showCart(myCart[items], itemAPI.price);
    }

    document.getElementById("cart__items").innerHTML = domUpdated

  }


  // Add delete envent to each product on cart
  async function addDeleteEvent() {
    const deleteBtn = document.querySelectorAll(".deleteItem");

    for (let i = 0; i < deleteBtn.length; i++) {
      deleteBtn[i].addEventListener("click", function(event) {
        event.preventDefault;
        let deletedItemId = myCart[i].id;
        let deletedItemColor = myCart[i].color

        // Keep others items 
        const myNewCart = myCart.filter(item => item.id !== deletedItemId || item.color !== deletedItemColor);

        localStorage.setItem("myCart", JSON.stringify(myNewCart));

        alert("Ce produit a été supprimé du panier");

        location.reload();
      })
    }
  }

  // get all elements and sum them into 'totalQuantity' element
  function showTotalQuantity() {
    let totalQuantity = 0;
    const itemQuantity = document.getElementById("totalQuantity");

    for (let item in myCart) {
      totalQuantity += myCart[item].quantity;
    }

    itemQuantity.innerText = totalQuantity;
  }


  // get all elements and sum their price into 'totalPrice' element
  async function showTotalPrice() {
    let totalPrice = 0;
    const itemPrice = document.getElementById("totalPrice");
    for (let item in myCart) {
      let product = await getItemById(myCart[item].id)
      totalPrice += (product.price * myCart[item].quantity);
    }

    itemPrice.innerText = totalPrice;
  }



  // Add the 'change' event to each product quantity and refresh items after change
  function changeQuantity() {
    const quantitySelector = document.getElementsByClassName("itemQuantity");

    for (let p = 0; p < quantitySelector.length; p++) {
      quantitySelector[p].addEventListener("change", function(event) {

        let quantityChanged = quantitySelector[p].valueAsNumber;
        if (quantityChanged < 1) {
          alert('Veuillez choisir une quantité comprise entre 1 et 100')
          quantityChanged = 1
        } else if (quantityChanged > 100) {
          alert('Veuillez choisir une quantité comprise entre 1 et 100')
          quantityChanged = 100
        }

        const dataId = event.target.getAttribute("data-id");
        const dataColor = event.target.getAttribute("data-color");
        const currentElementIncart = myCart.find(item => item.id === dataId && item.color === dataColor)
        currentElementIncart.quantity = quantityChanged
        quantitySelector[p].valueAsNumber = quantityChanged
        localStorage.setItem("myCart", JSON.stringify(myCart));

        //recalculate total quantity
        showTotalQuantity()

        // recalculate total price
        showTotalPrice()
      })
    }
  }

  // Check if user input is correct for each field before sending it
  function formVerification() {

    const verifyFirstName = document.getElementById("firstName");
    verifyFirstName.setAttribute("pattern", "[a-zA-Z-éèà]*");

    const verifyLastName = document.getElementById("lastName");
    verifyLastName.setAttribute("pattern", "[a-zA-Z-éèà]*");

    const verifyCity = document.getElementById("city");
    verifyCity.setAttribute("pattern", "[a-zA-Z-éèà]*");

    const verifyEmail = document.getElementById("email");
    verifyEmail.setAttribute("pattern", "[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+.[a-zA-Z.]{2,15}");

    //Get Id's to send to API
    const getId = myCart.map(item => item.id);

    //Validate data from user to sent to API
    document.querySelector(".cart__order__form__submit").addEventListener("click", async function(e) {
      e.preventDefault();
      let valid = true;
      for (let input of document.querySelectorAll(".cart__order__form__question input")) {
        valid &= input.reportValidity();

        if (!valid) {
          break;
        }
      }
      if (valid) {
        try {
          const response = await fetch("http://localhost:3000/api/products/order", {
            method: "POST",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              contact: {
                firstName: document.getElementById("firstName").value,
                lastName: document.getElementById("lastName").value,
                address: document.getElementById("address").value,
                city: document.getElementById("city").value,
                email: document.getElementById("email").value
              },
              products: getId
            })
          })
          const data = await response.json()
          window.location.href = `confirmation.html?id=${data.orderId}`;
          localStorage.clear();
        } catch (error) {
          console.error(error)
        }
      }
    })

  }


  async function process() {
    await getCart()
    await addDeleteEvent()
    showTotalQuantity();
    await showTotalPrice();
    changeQuantity();
  }

  process()
  formVerification()
}