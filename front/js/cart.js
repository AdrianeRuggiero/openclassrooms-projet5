const myCart = JSON.parse(localStorage.getItem("myCart"));

//Disable order button
function disableButton() {
  document.getElementById("order").disabled = true;
}

//Enable order
function enableButton() {
  document.getElementById("order").disabled = false;
}

//Shows a message if the cart is empty
if (myCart == null || myCart.length == 0) {
  document.getElementById("cart__items").innerText += `Votre panier est vide`;
  disableButton()
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
    // myCart.forEach(canap => totalQuantity += canap.quantity)


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


  //Verify user information
  async function formVerification() {


    const firstName = document.querySelector("#firstName");
    const lastName = document.querySelector("#lastName");
    const address = document.querySelector("#address");
    const city = document.querySelector("#city");
    const email = document.querySelector("#email");
    disableButton()

    //Verify first name
    const firstNameValidation = document.querySelector("#firstNameErrorMsg");
    firstName.addEventListener("change", function(e) {
      if (/^[A-Z][A-Za-z\é\è\ê\- ]+$/.test(e.target.value)) {
        firstNameValidation.innerHTML = "";
        enableButton()
      } else {
        firstNameValidation.innerHTML = "Le prénom doit commencer par une majuscule.";
        disableButton()
      }
    })

    // Verify last name
    const lastNameValidation = document.querySelector("#lastNameErrorMsg");
    lastName.addEventListener("change", function(e) {
      if (/^[A-Z][A-Za-z\é\è\ê\- ]+$/.test(e.target.value)) {
        lastNameValidation.innerHTML = "";
        enableButton()
      } else {
        lastNameValidation.innerHTML = "Nom incorrect"
        disableButton()
      }
    })

    // Verify adress
    const addressValidation = document.querySelector("#addressErrorMsg");
    address.addEventListener("change", function(e) {
      if (/^.{3,144}$/.test(e.target.value)) {
        addressValidation.innerHTML = "";
        enableButton()
      } else {
        addressValidation.innerHTML = "Adresse incorrect"
        disableButton()
      }
    })

    // Verify city
    const cityValidation = document.querySelector("#cityErrorMsg");
    city.addEventListener("change", function(e) {
      if (/^[A-Z][A-Za-z\é\è\ê\- ]+$/.test(e.target.value)) {
        cityValidation.innerHTML = "";
        enableButton()
      } else {
        cityValidation.innerHTML = "Veuillez vérifier la ville"
        disableButton()
      }
    })

    // Verify email
    const emailValidation = document.querySelector("#emailErrorMsg");
    email.addEventListener("change", function(e) {
      if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(e.target.value)) {
        emailValidation.innerHTML = "";
        enableButton()
      } else {
        emailValidation.innerHTML = "Adresse email incorrect"
        disableButton()
      }
    })

  }




  // Sends the order and gets their ID
  async function submitOrder() {

    const firstNameValidation = document.querySelector("#firstNameErrorMsg");
    const lastNameValidation = document.querySelector("#lastNameErrorMsg");
    const addressValidation = document.querySelector("#addressErrorMsg");
    const cityValidation = document.querySelector("#cityErrorMsg");
    const emailValidation = document.querySelector("#emailErrorMsg");


    const submitBtn = document.querySelector("#order");
    submitBtn.addEventListener("click", async function(e) {
      e.preventDefault();
      if (firstNameValidation.innerHTML == "" && lastNameValidation.innerHTML == "" && addressValidation.innerHTML == "" && cityValidation.innerHTML == "" && emailValidation.innerHTML == "") {
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
              products: myCart.map(item => item.id)
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
    formVerification();
    submitOrder();
  }

  process()

}