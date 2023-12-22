var express =require('express');
var router = express.Router();
router.use(express.json());
const product_det = require('../productDetails');

router.get('/productsDetails',(req,res)=>{
    res.send(product_det)
})
router.get('/productsDetails/:id',(req,res)=>{
   let details = product_det.find(p=>p.id === parseInt(req.params.id));
   if(!product) 
   return res.status(404).send('Product not found');
   res.send(details);
})
router.post('/productsDetails',(req,res)=>{
    if(!req.body.name||!req.body.categoryid){
        return res.status(400).send('Name or the category id not given');
    }
    else res.status(201);

    const details = {
        id: product_det.length +1,
        stock:req.body.stock,
        price: req.body.price
    };
    product_det.push(details);
    res.send(details);
    })
router.put('/productsDetails/:id',(req,res)=>{
    let details = product_det.find(p=>p.id === parseInt(req.params.id));
    if(!details) return res.status(404).send('details not found'); 
    if(!req.body.name||!req.body.categoryid){
        return res.status(400).send('Name or the category id not given')
    }
    details.categoryid = req.body.categoryid;
    details.name = req.body.name;
    res.send(details);

})
router.delete('/productsDetails/:id',(req,res)=>{
    let details = product_det.find(p=>p.id === parseInt(req.params.id));
    if(!details)res.status(404).send('details not found'); 
    else res.status(204)
    const index = product_det.indexOf(details);
    product_det.splice(index,1);
    let details1 = product_det.find(p=>p.id === parseInt(req.params.id));
    res.send(details1);
})
module.exports = router;