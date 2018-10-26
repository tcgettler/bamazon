module.exports = function(sequelize, DataTypes){
    const Products = sequelize.define('Product', {
        product_name:{
            type: DataTypes.STRING
        },
        department_name: {
            type: DataTypes.STRING
        },
        price: {
            type: DataTypes.DECIMAL(10, 2)
        },
        description: {
            type: DataTypes.STRING
        },
        stock_quantity: {
            type: DataTypes.INTEGER
        },
        image_location: {
            type: DataTypes.STRING
        }
    });

    return Products;
};


