'use strict';
const db = require('../models');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Products', [{
      product_name: 'Duct Tape',
      department_name: 'Tools',
      price: 19.99,
      description: "Some duct tape for all your body shaping needs.",
      stock_quantity:10,
      image_location: 'media/ducktape.jpg'
    },
    {
      product_name: 'Kinky Boots',
      department_name: 'Clothing',
      price: 142.00,
      description: "These boots were made for walking.",
      stock_quantity:10,
      image_location: 'media/kinkyboots.jpg'
    },
    {
      product_name: 'Makeup Kit',
      department_name: 'Tools',
      price: 74.99,
      description: "Transform yourself, from monster to queen.",
      stock_quantity:10,
      image_location: 'media/stagemakeup.jpg'
    },
    {
      product_name: 'Fall Earrings',
      department_name: 'Accessories',
      price: 18.99,
      description: "Big earrings for a big personality.",
      stock_quantity:10,
      image_location: 'media/earrings.jpg'
    },
    {
      product_name: 'Corset',
      department_name: 'Clothing',
      price: 41.00,
      description: "Look as skinny as you feel.",
      stock_quantity:10,
      image_location: 'media/corset.jpg'
    },
    {
      product_name: 'Glue Stick',
      department_name: 'Tools',
      price: 7.99,
      description: "You'll need this, so might as well buy in bulk.",
      stock_quantity:10,
      image_location: 'media/gluestick.jpg'
    },
    {
      product_name: 'Body Pads',
      department_name: 'Tools',
      price: 34.45,
      description: "Make the body of your dreams.",
      stock_quantity:10,
      image_location: 'media/hippad.jpg'
    },
    {
      product_name: 'Hand Fan',
      department_name: 'Accessories',
      price: 29.99,
      description: "For all your thworiping needs.",
      stock_quantity:10,
      image_location: 'media/handfan.jpg'
    },
    {
      product_name: 'Gaudy Purse',
      department_name: 'Accessories',
      price: 45.99,
      description: "Always walk into the room purse first.",
      stock_quantity:10,
      image_location: 'media/purse.jpg'
    },
    {
      product_name: 'Rainbow Gown',
      department_name: 'Clothing',
      price: 19.99,
      description: "Make sure your dress as loud as your personality.",
      stock_quantity:10,
      image_location: 'media/gown.jpg'
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Product', null, {});
  }
};

