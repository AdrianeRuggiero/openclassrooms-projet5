function createProductPage() {

    const productPage = window.location.href;
    const page = new URL(productPage);
    const productId = page.searchParams.get("id");

    getProduct(productId)

}

// Gets the data from API by ID

function getProduct (productId){ 

    fetch("http://localhost:3000/api/products/" + productId)
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        showProduct(data);
    })
    
};

// Shows product's info 

function showProduct(article){

    let imageProduct = document.createElement("img");
    document.querySelector(".item__img").appendChild(imageProduct);
    imageProduct.src = article.imageUrl;
    imageProduct.alt = article.altTxt;

    document.querySelector("#title").innerHTML = article.name;
    
    document.querySelector("#price").innerHTML = article.price;
    
    document.querySelector("#description").innerHTML = article.description;

    // Show avaiables colors
        for(let color of article.colors){
        let colorProduct = document.createElement("option");
        document.querySelector("#colors").appendChild(colorProduct),
        colorProduct.value = color;
        colorProduct.innerHTML = color;
    }
};

createProductPage();