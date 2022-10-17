function createProductPage() {

    const productPage = window.location.href;
    const page = new URL(productPage);
    const productId = page.searchParams.get("id");

    getProduct(productId)

}

// Gets the data from API by ID

async function getProduct (productId){ 

   try {
    const response = await fetch("http://localhost:3000/api/products/" + productId)
                            .then(response => response.json());
    showProduct(response);
    sendProductToCart(response);
   } catch (error) {
        console.error(error);
    } 

};

// Shows product's info 

function showProduct(product){

    let imageProduct = document.createElement("img");
    document.querySelector(".item__img").appendChild(imageProduct);
    imageProduct.src = product.imageUrl;
    imageProduct.alt = product.altTxt;

    document.getElementById('title').textContent = product.name;
    document.getElementById('price').textContent = product.price;
    document.getElementById('description').textContent = product.description;

    // Show avaiables colors
        for(let color of product.colors){
        let colorProduct = document.createElement("option");
        document.getElementById('colors').appendChild(colorProduct),
        colorProduct.value = color;
        colorProduct.textContent = color;
    }
};

createProductPage();

function sendProductToCart(product){

    const cartBtn = document.getElementById("addToCart");
    const productColors = document.getElementById("colors");
    const productQuantity = document.getElementById("quantity");

    cartBtn.addEventListener("click", function(){
        const myProduct = {
            Name : product.name,
            ID: product._id,
            Picture: product.imageUrl,
            PictureTxt: product.altTxt,
            Price: product.price,
            Color: productColors.value,
            Quantity: parseInt(productQuantity.value, 10)
        };

        if(productQuantity.value !== 0 && productColors.value !== ""){

        let productsInCart = JSON.parse(localStorage.getItem("myCart"));
        if(productsInCart){

            const productControl = productsInCart.find(sofa => sofa.ID == product._id && sofa.Color == productColors.value)
            if(productControl){
                let finalQuantity = myProduct.Quantity + productControl.Quantity;
                productControl.Quantity = finalQuantity;
                saveCart(productsInCart)
            }
            else {
                productsInCart.push(myProduct);
                saveCart(productsInCart);
            }
        }
        else{
            productsInCart = [];
            productsInCart.push(myProduct);
            saveCart(productsInCart);
        }
        alert("Le produit a été ajouté au panier")
    }
    })

}


function saveCart(cart){
    localStorage.setItem("myCart", JSON.stringify(cart));
}