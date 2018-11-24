const db = require('../models');

module.exports = function(app){
    
    app.get('/api/products', function(req,res){
        db.Product.findAll({}).then(function(rows){
            res.json(rows);
        }).catch(function(err){
            res.json({error: err});
        });
    });

    app.get('/api/products/:id', function(req, res) {
        db.Product.find({ where: { id: req.params.id }})
          .then(function(data){
            res.json(data);
          }).catch(function(error) {
            res.json({ error: error });
          });
    });
    
    app.put('/api/products/:id', function(req, res){
        console.log(req.params.id, req.body);
       db.Product.update({stock_quantity: parseInt(req.body.stock_quantity)}, {where: {id: parseInt(req.params.id)}})
            .then(function(response){
                res.json(response);
            });
    });

};