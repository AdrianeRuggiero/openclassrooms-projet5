// Creates the HTML to insert into the DOM

function showProducts(article) {
  return ` <a href="./product.html?id=${article._id}">
              <article>
                <img src="${article.imageUrl}" alt="${article.altTxt}">
                <h3 class="productName">${article.name}</h3>
                <p class="productDescription">${article.description}</p>
              </article>
            </a>
          `;
}


// Calls the API to acces the products
async function getProducts() {
  await fetch('http://localhost:3000/api/products')
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      let productsToShow = '';
      for (let article in data) {
        productsToShow += showProducts(data[article]);
      }
      document.getElementById('items').innerHTML = productsToShow;
    })
}

getProducts();