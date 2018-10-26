let cart = [];

const render = function(data){
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
                                                <input type="text" class="form-control" value="0" id="amount${data[i].id}">
                                            <div class="input-group-append">
                                                <button class="btn btn-primary plus" data-container="body" data-toggle="popover" data-placement="top" data-content="Not enough inventory" type="button" id="plus${data[i].id}"><i class="fas fa-plus"></i></button>
                                            </div>
                                        </div>
                                        <button class="btn btn-primary float-right submit" type="submit" id="submit${data[i].id}">Order</button>
                                    </div>
                                </div>
                            </div>`);
    };
};

const renderCart = function(){
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
        $('#cart-contents').append(
            `<div class="row d-flex">
                <div class="col-1 align-self-center">${i+1}</div>
                <div class="col-2 text-center align-self-center">${cart[i].name}</div>
                <div class="col-3 text-center"><img src="${cart[i].image}" width=50%" height="auto"></div>
                <div class="col-1 text-center align-self-center">${cart[i].quantity}</div>
                <div class="col-1 text-center align-self-center">$${cart[i].price}</div>
                <div class="col-2 text-center align-self-center">$${cart[i].total}</div>
                <div class="col-1 text-right align-self-center"><button class="btn btn-trash"><i class="far fa-trash-alt" id="trash${i}"></i></button></div>
            </div>`
        )
    }
}
const getProducts = function(){
    $.ajax({
        url: '/api/products',
        method: 'GET'
    }).then(function(response){
        render(response);
    })
}

const getQuantity = function(event, id){
    event.preventDefault;
    $.ajax({
        url: `/api/products/${id}`,
        method: 'GET'
    }).then(function(response){
        increaseQuantity(id, response.stock_quantity);
    });
}

const increaseQuantity = function(id, currentQty){
    id = "#amount" + id;
    console.log($(id).val());
    if (parseInt(currentQty) <= parseInt($(id).val())){
        return;
    } else {
      $(id).val((parseInt($(id).val())+1));
    };
};

const decreaseQuantity = function(event, id){
    event.preventDefault;
    id = "#amount" + id.slice(5);
    if (parseInt($(id).val()) > 0){
        $(id).val((parseInt($(id).val())-1));
    };
}


const submitOrder = function(event, id){
    event.preventDefault;
    let qty = "#amount" + id;
    let total = 0;
    qty = parseInt($(qty).val());
    if (qty === 0 ){
        return;
    }
    $.ajax({
        url: `/api/products/${id}`,
        method: 'GET'
    }).then(function(res){
        console.log('test');
        total = parseFloat(res.price) * qty;
        if (cart.length > 0){
            let update = false;
            for (let i=0; i < cart.length; i++){
                if (res.id === cart[i].id){
                    total += cart[i].total;
                    qty += cart[i].quantity;
                    if (qty > res.stock_quantity){
                        qty = res.stock_quantity;
                    };
                    cart.splice(i,1,{
                        id: res.id,
                        name: res.product_name,
                        price: res.price,
                        quantity: qty,
                        total: total,
                        image: res.image_location
                    });
                    update = true;
                }  
            };
            if (update === false){
                cart.push({
                    id: res.id,
                    name: res.product_name,
                    price: res.price,
                    quantity: qty,
                    total: total,
                    image: res.image_location
                }); 
            };
            renderCart();
        } else {
            cart.push({
                id: res.id,
                name: res.product_name,
                price: res.price,
                quantity: qty,
                total: total,
                image: res.image_location
            }); 
            renderCart();
        };
       
    });
}
$(document).ready(function(){
    getProducts();
});

$('#content').on('click', '.minus', function(event){
    decreaseQuantity(event, $(this).attr('id'));
});

$('#content').on('click', '.plus', function(event){
    getQuantity(event, $(this).attr('id').slice(4));
});

$('#content').on('click', '.submit', function(event){
    submitOrder(event, $(this).attr('id').slice(6));
})

