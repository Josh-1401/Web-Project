var express =require('express');
var router = express.Router();
router.use(express.json());
const products = require('../productsData');
const product_det = require('../productDetails');


router.get('/products',(req,res)=>{
    res.send(products)
})
router.get('/products/:id',(req,res)=>{
   let product = products.find(p=>p.id === parseInt(req.params.id));
   if(!product) 
   return res.status(404).send('Product not found');
   res.send(product);
})
router.post('/products',(req,res)=>{
    if(!req.body.name||!req.body.categoryid){
        return res.status(400).send('Name or the category id not given');
    }
    else res.status(201);

    const product = {
        id: products.length +1,
        categoryid:req.body.categoryid,
        name: req.body.name
    };
    products.push(product);
    res.send(product);
    })
router.put('/products/:id',(req,res)=>{
    let product = products.find(p=>p.id === parseInt(req.params.id));
    if(!product) return res.status(404).send('Product not found'); 
    if(!req.body.name||!req.body.categoryid){
        return res.status(400).send('Name or the category id not given')
    }
    product.categoryid = req.body.categoryid;
    product.name = req.body.name;
    res.send(product);

})
router.delete('/products/:id',(req,res)=>{
    let product = products.find(p=>p.id === parseInt(req.params.id));
    if(!product)res.status(404).send('Product not found'); 
    else res.status(204)
    const index = products.indexOf(product);
    products.splice(index,1);
    let product1 = products.find(p=>p.id === parseInt(req.params.id));
    res.send(product1);
})
module.exports = router;