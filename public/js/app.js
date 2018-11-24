//create an array to store cart contents
let cart = [];

//render the inventory of items from the database
const render = function(data){
    $('#content').empty();
    for (let i = 0; i < data.length; i++){
        $('#content').append(`<div class="col-lg-3">
                                <div class="card">
                                    <img class="card-img-top" src="${data[i].image_location}" max-width="100%" max-height="100%" alt="Card image cap">
                                    <div class="card-body">
                                        <h5 class="card-title float-left">${data[i].product_name}</h5>
                                        <h5 class="card-title float-right">$${data[i].price}</h5>
                                        <br>
                                        <hr>
                                        <p class="card-text">${data[i].description}</p>
                                        <label for="order">Quantity:</label>
                                        <br>
                                        <div class="input-group mb-3 quantity float-left">
                                            <div class="input-group-prepend">
                                                <button class="btn btn-outline-secondary minus" type="button" id="minus${data[i].id}"><i class="fas fa-minus"></i></button>
                                            </div>
                                                <input type="text" class="form-control amount" value="0" id="amount${data[i].id}">
                                            <div class="input-group-append">
                                                <button class="btn btn-primary plus" data-container="button" data-toggle="popover" data-placement="top" data-content="At inventory limit!" type="button" id="plus${data[i].id}"><i class="fas fa-plus"></i></button>
                                            </div>
                                        </div>
                                        <button class="btn btn-primary float-right submit" type="submit" id="submit${data[i].id}">Order</button>
                                    </div>
                                </div>
                            </div>`);
    };
};

//render manager view
const renderManager = function(data){
    $('#content').empty();
    console.log(data);
    for (let i = 0; i < data.length; i++){
        $('#content').append(`<div class="col-lg-3">
                                <div class="card position-relative">
                                    <img class="card-img-top" src="${data[i].image_location}" max-width="100%" max-height="100%" alt="Card image cap">
                                    <div class="card-body">
                                        <h5 class="card-title float-left">${data[i].product_name}</h5>
                                        <h5 class="card-title float-right">$${data[i].price}</h5>
                                        <br>
                                        <hr>
                                        <p class="card-text">${data[i].description}</p>
                                        <p>Current Stock: ${data[i].stock_quantity}</p>
                                        <button class="btn btn-primary float-right addStock" type="submit" id="addStock${data[i].id}">Add Stock</button>
                                        <br>
                                    </div>
                                </div>
                            </div>`);
    };
}

//toggle the modal and render all the items
const renderCart = function(){
    let grandtotal = 0;
    let tax = .065;
    $('#cart-contents').empty();
    $('#cart-contents').append(`<div class="row">
    <div class="col-1"></div>
    <div class="col-2 text-center">Item</div>
    <div class="col-3"></div>
    <div class="col-1 text-center">Qty</div>
    <div class="col-1 text-center">Price</div>
    <div class="col-2 text-center">Total</div> 
    <div class="col-1></div>
</div>`)
    $('#cart').modal('show');
    for (let i = 0; i < cart.length; i++){
        grandtotal += cart[i].total;
        $('#cart-contents').append(
            `<div class="row d-flex">
                <div class="col-1 align-self-center">${i+1}</div>
                <div class="col-2 text-center align-self-center">${cart[i].name}</div>
                <div class="col-3 text-center"><img src="${cart[i].image}" width=50%" height="auto"></div>
                <div class="col-1 text-center align-self-center">${cart[i].quantity}</div>
                <div class="col-1 text-center align-self-center">$${cart[i].price}</div>
                <div class="col-2 text-center align-self-center">$${cart[i].total.toFixed(2)}</div>
                <div class="col-1 text-right align-self-center"><button class="btn btn-trash" id="trash${i}"><i class="far fa-trash-alt" ></i></button></div>
            </div>`   
        )
    };
    $('#cart-contents').append(`<div class="row d-flex">
                                    <div class="col-6"></div>
                                    <div class="col-2"><h5>+ Tax</h5></div>
                                    <div class="col-2 text-center">$${(tax * grandtotal).toFixed(2)}</div>
                                </div>
                                <div class="row d-flex">
                                    <div class="col-6"></div>
                                    <div class="col-2"><h5>+ Shipping</div>
                                    <div class="col-2 text-center">$5.99</div>
                                </div>
                                <div class="row d-flex">
                                    <div class="col-8"></div>
                                    <div class="col-2"><hr></div>
                                </div>
                                <div class="row d-flex">
                                    <div class="col-6"></div>
                                    <div class="col-2"><h5>Grand Total:</h5></div>
                                    <div class="col-2 text-center">$${(grandtotal + (tax*grandtotal) + 5.99).toFixed(2)}</div>
                                </div>`);
}

//obtain all the products in the database
const getProducts = function(view, status){
    $.ajax({
        url: '/api/products',
        method: 'GET'
    }).then(function(response){
        if(view === "user"){
            render(response);
        } else if (view === "manager"){
            if(status === "low"){
                let lowStock=[];
                for (let i = 0; i < response.length; i ++){
                    if (response[i].stock_quantity < 5){
                        lowStock.push(response[i]);
                    }
                }
                renderManager(lowStock);
            } else {
                renderManager(response);
            };
        }
    })
}

//obtain the quantity of a specific item
const getQuantity = function(event, id){
    event.preventDefault;
    $.ajax({
        url: `/api/products/${id}`,
        method: 'GET'
    }).then(function(response){
        //if increasing the quantity with the plus sign, go to increase quantity
        if (event.type === "click"){
            increaseQuantity(id, response.stock_quantity);
        //If increasing the quantity with the input field, go to set quantity    
        } else {
            setQuantity(id, response.stock_quantity);
        }
    });
}

//delete item in shopping cart when trash can is clicked.
const deleteCartItem = function(event, id){
    event.preventDefault;
    console.log(id);
    cart.splice(id, 1);
    renderCart();
}

//set the quantity of the input field when entered, only going to the max stock amount
const setQuantity = function(id, currentQty){
    id = "#amount" + id;
    if (parseInt(currentQty) <= parseInt($(id).val())){
        $(id).val(currentQty);
    } else {
        return;
    };
};

//increase the quantity of the input field when clicking the plus sign up to the stock quantity.
const increaseQuantity = function(id, currentQty){
    id = "#amount" + id;
    if (parseInt(currentQty) <= parseInt($(id).val())){
        $(id).popover('show');
        return;
    } else {
      $(id).val((parseInt($(id).val())+1));
    };
};

//decrease the quantity of the input field when clicking the minus sign until 0 is reached
const decreaseQuantity = function(event, id){
    event.preventDefault;
    id = "#amount" + id.slice(5);
    if (parseInt($(id).val()) > 0){
        $(id).val((parseInt($(id).val())-1));
    };
}

//Add item and quantity to cart when order is clicked
const addToCart = function(event, id){
    event.preventDefault;
    let qty = "#amount" + id;
    let total = 0;
    qty = parseInt($(qty).val());
    if (qty === 0 ){
        return;
    }
    //make call to the database to obtained item
    $.ajax({
        url: `/api/products/${id}`,
        method: 'GET'
    }).then(function(res){
        total = parseFloat(res.price) * qty;
        //check to make sure this isn't to update the cart quantity.
        if (cart.length > 0){
            let update = false;
            //run through cart to make sure item isn't already in there.
            for (let i=0; i < cart.length; i++){
                if (res.id === cart[i].id){
                    total += cart[i].total;
                    qty += cart[i].quantity;
                    if (qty > res.stock_quantity){
                        qty = res.stock_quantity;
                    };
                    //if item is in there, update with new object
                    cart.splice(i,1,{
                        id: res.id,
                        name: res.product_name,
                        price: res.price,
                        quantity: qty,
                        total: total,
                        image: res.image_location,
                        stock_quantity: res.stock_quantity
                    });
                    //let code know that it's updated.
                    update = true;
                }  
            };
            //if no update is needed, add item to cart as new item
            if (update === false){
                cart.push({
                    id: res.id,
                    name: res.product_name,
                    price: res.price,
                    quantity: qty,
                    total: total,
                    image: res.image_location,
                    stock_quantity: res.stock_quantity
                }); 
            };
            //render the shopping cart
            renderCart();
        } else {
            //if cart is empty add item to cart
            cart.push({
                id: res.id,
                name: res.product_name,
                price: res.price,
                quantity: qty,
                total: total,
                image: res.image_location,
                stock_quantity: res.stock_quantity
            }); 
            renderCart();
        };
       
    });
}

//update database with cart contents
const submitOrder = function(event){
    event.preventDefault;
    let updateStock = [];
    for(let i=0; i < cart.length; i++){
        updateStock.push({
            id: cart[i].id,
            stock_quantity: parseInt(cart[i].stock_quantity) - parseInt(cart[i].quantity)     
        });
    };
    updateStock.forEach(function(data){
        console.log(data);
        $.ajax({
            url: `/api/products/${data.id}`,
            method: 'PUT',
            data: data
        }).then(function(response){
            console.log(response);
        }).catch(function(error){
            if(error){
                console.log(error);
            }
        })
    })
    cart.splice(0, cart.length);
    $('#cart').modal('hide');
    renderCart();
    animateAlert();
};

//display alert notifying user of order placed
const animateAlert = function(){
    $('#orderCompleted').animate({
        opacity: 1,
      }, 1000, function() {
        // Animation complete.
      });
    $('#orderCompleted').delay(5000).animate({
        opacity:0,
    }, 1000, function(){
        //animationcompleted
    });
  
}

//obtain stock of a particalur item
const getStock = function(event, id){
    event.preventDefault;
    $.ajax({
        url: `/api/products/${id}`,
        method: 'GET'
    }).then(function(response){
        addStock(response);
    }).catch(function(err){
        console.log(err);
    });
};

//create modal to confirm addition to stock
const addStock = function(data){
    console.log(data);
    $('#addStock-contents').empty();
    $('#addStock-contents').append(`<div class="row">
                                        <div class="col-1"></div>
                                        <div class="col-2 text-center">Item</div>
                                        <div class="col-2"></div>
                                        <div class="col-4 text-center">Price</div>
                                        <div class="col-2 text-center">Total Qty</div> 
                                        <div class="col-1></div>
                                    </div>`);
    $('#addStock').modal('show');
    $('#addStock-contents').append(`<div class="row d-flex">
                                        <div class="col-1"></div>
                                        <div class="col-2 text-center align-self-center">${data.product_name}</div>
                                        <div class="col-2 text-center"><img src="${data.image_location}" width=50%" height="auto"></div>
                                        <div class="col-4 text-center align-self-center">$${data.price}</div>
                                        <div class="col-2 text-center align-self-center"><input type="number" class="form-control" value='${data.stock_quantity}' id="totalQty"></div>
                                        <div class="col-1"></div>
                                    </div>`);
    $('.confirmAdd').attr('id', data.id);         
}

//confrim addition to stock, updating database
const confirmAdd = function(event, id){
    event.preventDefault;
    console.log(id);
    const stock_quantity = parseInt($('#totalQty').val());
    const updateStock = {id: id, stock_quantity: stock_quantity};
    $.ajax({
        url: `/api/products/${updateStock.id}`,
        method: 'PUT',
        data: updateStock
    }).then(function(response){
        getProducts('manager');
        $('#addStock').modal('hide');
    }).catch(function(error){
        if(error){
            console.log(error);
        }
    });
    
};

//render page when site loads
$(document).ready(function(){
    getProducts('user');
});

//decrease quantity field
$('#content').on('click', '.minus', function(event){
    decreaseQuantity(event, $(this).attr('id'));
});

//increase quantity field
$('#content').on('click', '.plus', function(event){
    getQuantity(event, $(this).attr('id').slice(4));
});

//add quantity to cart
$('#content').on('click', '.submit', function(event){
    addToCart(event, $(this).attr('id').slice(6));
});

//update quantity field
$('#content').on('change', '.amount', function(event){
    getQuantity(event, $(this).attr('id').slice(6));
});

//Manager item button functions
$('#content').on('click', '.addStock', function(event){
    getStock(event, $(this).attr('id').slice(8));
});

//confirm addition of stock
$('.confirmAdd').on('click', function(event){
    confirmAdd(event, parseInt($(this).attr('id')));
})
//Shopping cart functions
$('#cart-contents').on('click', '.btn-trash', function(event){
    deleteCartItem(event, $(this).attr('id').slice(5));
});

//submit the order
$('#checkout').on('click', function(event){
    submitOrder(event);
});

//open the cart when clicking the icon
$('#open-cart').on('click', function(event){
    event.preventDefault;
    renderCart();
})

//Top menu functions
$('#user').on('click', function(event){
    event.preventDefault;
    $('#user').attr('disabled', true);
    $('#manager').attr('disabled', false);
    $('#moreMenu').empty();
    getProducts('user');
});

//display manager view
$('#manager').on('click', function(event){
    event.preventDefault;
    $('#user').attr('disabled', false);
    $('#manager').attr('disabled', true);
    $('#moreMenu').append(`<div class="col-2 d-inline">
                                <button class="btn btn-third" id="viewAll" disabled>View All</button>
                            </div>
                            <div class="col-2 d-inline">
                                <button class="btn btn-third" id="viewLow">View Low Stock</button>
                            </div>
                            `);
    getProducts('manager');
});

//render all products menu
$('#moreMenu').on('click', '#viewAll', function(event){
    event.preventDefault;
    $('#viewAll').attr('disabled', true);
    $('#viewLow').attr('disabled', false);
    getProducts('manager');
})

//render low products
$('#moreMenu').on('click', '#viewLow', function(event){
    event.preventDefault;
    $('#viewLow').attr('disabled', true);
    $('#viewAll').attr('disabled', false);
    getProducts('manager', 'low');
})