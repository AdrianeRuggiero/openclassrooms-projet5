const myCart = JSON.parse(localStorage.getItem("myCart"));
const orderBtn = document.getElementById("order");

/*orderBtn.setAttribute("disabled", true);*/

function showCart(item, price) {
  return `<article class="cart__item" data-id="${item.ID}" data-color="${item.color}">
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
          <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${item.quantity}">
        </div>
        <div class="cart__item__content__settings__delete">
          <p class="deleteItem">Supprimer</p>
        </div>
      </div>
    </div>
  </article>`
}

function getItemById(productId) {
  return fetch('http://localhost:3000/api/products/' + productId)
    .then(function(response) {
      return response.json();
    })
}

// Show itens from localStorage
async function getCart() {
  let domUpdated = ''
  for (let items in myCart) {
    let itemAPI = await getItemById(myCart[items].ID)
    domUpdated += showCart(myCart[items], itemAPI.price);
  }

  document.getElementById("cart__items").innerHTML = domUpdated

}


// Delete button
async function addDeleteEvent() {
  const deleteBtn = document.querySelectorAll(".deleteItem");

  for (let i = 0; i < deleteBtn.length; i++) {
    deleteBtn[i].addEventListener("click", function(event) {
      let deletedItemId = myCart[i].ID;
      let deletedItemColor = myCart[i].color

      // Keep others itens 
      const myNewCart = myCart.filter(item => item.ID !== deletedItemId || item.color !== deletedItemColor);

      localStorage.setItem("myCart", JSON.stringify(myNewCart));

      alert("Ce produit a été supprimé du panier");

      location.reload();
    })
  }
}

function showTotalQuantity() {
  let totalQuantity = 0;
  const itemQuantity = document.getElementById("totalQuantity");

  for (let item in myCart) {
    totalQuantity += myCart[item].quantity;
  }

  itemQuantity.innerText = totalQuantity;
}


async function showTotalPrice() {
  let totalPrice = 0;
  const itemPrice = document.getElementById("totalPrice");

  for (let item in myCart) {
    let product = await getItemById(myCart[item].ID)
    totalPrice = (product.price * myCart[item].quantity);
  }

  itemPrice.innerText = totalPrice;
}



// Change the quantity direct in the cart

function changeQuantity() {
  const quantitySelecter = document.getElementsByClassName("itemQuantity");

  for (let p = 0; p < quantitySelecter.length; p++) {
    quantitySelecter[p].addEventListener("change", function() {

      const oldQuantity = myCart[p].quantity;
      const quantityChanged = quantitySelecter[p].valueAsNumber;

      const quantityControl = myCart.find(element => element.quantityChanged !== oldQuantity);

      if (quantityChanged >= 1 && quantityChanged <= 100) {
        quantityControl.quantity = quantityChanged;
        myCart[p].quantity = quantityControl.quantity;
      } else {
        myCart.filter(element => element.quantity >= 1)
        alert('Veuillez choisir une quantité comprise entre 1 et 100')
      }
      localStorage.setItem("myCart", JSON.stringify(myCart));
      location.reload();
    })
  }
}


//Form Verification

const verifyFirstName = document.getElementById("firstName");
verifyFirstName.setAttribute("pattern", "[a-zA-Z-éèà]*");

const verifyLastName = document.getElementById("lastName");
verifyLastName.setAttribute("pattern", "[a-zA-Z-éèà]*");

const verifyCity = document.getElementById("city");
verifyCity.setAttribute("pattern", "[a-zA-Z-éèà]*");

const verifyEmail = document.getElementById("email");
verifyEmail.setAttribute("pattern", "[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+.[a-zA-Z.]{2,15}");

//Get Id's to send to API

const getId = myCart.map(item => item.ID);

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


async function process() {
  await getCart()
  await addDeleteEvent()
  await showTotalQuantity();
  await showTotalPrice();
  await changeQuantity();
}

process()