// Crée le html à insérer dans le DOM pour chaque produit

function showProducts(e){
  return `
      <a href="./product.html?id=${e._id}">
          <article>
            <img src="${e.imageUrl}" alt="${e.altTxt}">
            <h3 class="productName">${e.name}</h3>
            <p class="productDescription">${e.description}</p>
          </article>
      </a>
  `;
}


// Appelle l'API pour récupérer les données produits

async function getProducts(){
 await fetch('http://localhost:3000/api/products')
      .then(function(response){
          return response.json();
      })
      .then(function(data){
          for(let item in data){
              document.querySelector("#items").innerHTML += showProducts(data[item]);
          }
      }) 
}

getProducts();

