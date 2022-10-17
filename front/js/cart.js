const myCart = JSON.parse(localStorage.getItem("myCart"));
const orderBtn = document.getElementById("order");
const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const address = document.getElementById("address");
const city = document.getElementById("city");
const email = document.getElementById("email");

/*orderBtn.setAttribute("disabled", true);*/

function showCart(item) {
    return `<article class="cart__item" data-id="${item.ID}" data-color="${item.Color}">
    <div class="cart__item__img">
      <img src="${item.Picture}" alt="${item.PictureTxt}">
    </div>
    <div class="cart__item__content">
      <div class="cart__item__content__description">
        <h2>${item.Name}</h2>
        <item>${item.Color}</item>
        <item>${item.Price} €</item>
      </div>
      <div class="cart__item__content__settings">
        <div class="cart__item__content__settings__quantity">
          <item>Qté : </item>
          <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${item.Quantity}">
        </div>
        <div class="cart__item__content__settings__delete">
          <p class="deleteItem">Supprimer</p>
        </div>
      </div>
    </div>
  </article>`
}

// Show itens from localStorage
function getCart() {
    for (let itens in myCart) {
        document.getElementById("cart__items").innerHTML += showCart(myCart[itens]);
    }
}


getCart();


// Delete button

const deleteBtn = document.querySelectorAll(".deleteItem");

for (let i = 0; i < deleteBtn.length; i++) {
    deleteBtn[i].addEventListener("click", function(event) {
        let deletedItemId = myCart[i].ID;
        let deletedItemColor = myCart[i].Color

        // Keep others itens 
        const myNewCart = myCart.filter(item => item.ID !== deletedItemId || item.Color !== deletedItemColor);

        localStorage.setItem("myCart", JSON.stringify(myNewCart));

        alert("Ce produit a été supprimé du panier");

        location.reload();
    })
}

function showTotalQuantity() {
    let totalQuantity = 0;
    const itemQuantity = document.getElementById("totalQuantity");

    for (let item in myCart) {
        totalQuantity += myCart[item].Quantity;
    }

    itemQuantity.innerText = totalQuantity;
}

showTotalQuantity();


function showTotalPrice() {
    let totalPrice = 0;
    const itemPrice = document.getElementById("totalPrice");

    for (let item in myCart) {
        totalPrice += (myCart[item].Price * myCart[item].Quantity);
    }

    itemPrice.innerText = totalPrice;
}

showTotalPrice();


function changeQuantity() {
    const myCart = document.querySelectorAll(".itemQuantity");
    for (let item = 0; item < myCart.length; item++) {
        myCart[item].addEventListener("change", function() {

            const oldQuantity = myCart[item].Quantity;
            const newQuantity = myCart[item].valueAsNumber;

            const quantityControl = myCart.find(item => item.newQuantity !== oldQuantity);

            if (newQuantity >= 1) {
                quantityControl.Quantity = newQuantity;
                myCart[item].Quantity = quantityControl.Quantity;
            }
            localStorage.setItem("myCart", JSON.stringify(myCart));
            location.reload();
        })
    }
}


changeQuantity();

//Form Verification

//PATTERN POUR VALIDATION DE LETTRES UNIQUEMENT

let verifyFirstName = document.getElementById("firstName");
verifyFirstName.setAttribute("pattern", "[a-zA-Z-éèà]*");

let verifyLastName = document.getElementById("lastName");
verifyLastName.setAttribute("pattern", "[a-zA-Z-éèà]*");

let verifyCity = document.getElementById("city");
verifyCity.setAttribute("pattern", "[a-zA-Z-éèà]*");

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
        /*
        const response = fetch("http://localhost:3000/api/products/order", {
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
        });
        response.then(async(response) => {
            try {
                const data = await response.json();
                window.location.href = `confirmation.html?id=${data.orderId}`;
                localStorage.clear();
            } catch (error) {}
        });
        */

        // vérification des input

        // appel POST
        // Promise version
        /*
        fetch("http://localhost:3000/api/products/order", {
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
            .then(response => response.json())
            .then(data => {
                window.location.href = `confirmation.html?id=${data.orderId}`;
                localStorage.clear();
            })
            .catch(error => console.error(error));
        */

        // async version
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