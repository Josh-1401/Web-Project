var express =require('express');
var router = express.Router();
router.use(express.json());
const products = require('../productsData');
const details = require('../productDetails');

const categories = [
    {
      id: 1,
      name: "fruits",
    },
    {
      id: 2,
      name: "vegetables",
    },
  ];
  //GET all categories
  router.get('/categories', (req, res) => {
    res.send(categories);
  });
  //GET by id
  router.get('/categories/:id',(req,res)=>{
    let category = categories.find(p=>p.id === parseInt(req.params.id));
    if(!category) 
    return res.status(404).send('Category not found');
    res.send(category);
 })
  router.delete('/categories/:id',(req,res)=>{
    let category = categories.find(p=>p.id === parseInt(req.params.id));
    if(!category)return res.status(404).send('Category not found'); 
    else res.status(204)
    const index = categories.indexOf(category);
    categories.splice(index,1);
    let category1 = categories.find(p=>p.id === parseInt(req.params.id));
    res.send(category1);
  })
  router.put('/categories/:id',(req,res)=>{
    let category = categories.find(p=>p.id === parseInt(req.params.id));
    if(!category) return res.status(404).send('category not found'); 
    if(!req.body.name){
        return res.status(400).send('Name  not given')
    }
    category.name = req.body.name;
    res.send(category);
})
router.post('/categories',(req,res)=>{
  if(!req.body.name){
      return res.status(400).send('Name not given');
  }
  else res.status(201);

  const category = {
      id: categories.length +1,
      name: req.body.name
  };
  categories.push(category);
  res.send(category);
  })
  //All products
  router.get('/allcategories/allproducts',(req,res)=> {
    res.send(products);
  })
  //GET products by category id
  router.get('/categories/:categoryid/products', (req, res) => {
    const categoryId = parseInt(req.params.categoryid);
    const categoryProducts = products.filter((p) => p.categoryid === categoryId);
    if (categoryProducts.length === 0) return res.status(404).send('Category not found or no products in this category');
    res.send(categoryProducts);
  });

  //GET each product by its id through each category
  router.get('/categories/:categoryid/products/:id', (req, res) => 
  {
    const categoryId = parseInt(req.params.categoryid);
    const categoryProducts = products.filter((p) => p.categoryid === categoryId);
    let product = categoryProducts.find(p=>p.id === parseInt(req.params.id));
    if(!product) 
    return res.status(404).send('Product not found');
    res.send(product);  
  })
  //PUT METHOD
  router.put('/categories/:categoryid/products/:id',(req,res)=>{
    const categoryId = parseInt(req.params.categoryid);
    const categoryProducts = products.filter((p) => p.categoryid === categoryId);
    let product = categoryProducts.find(p=>p.id === parseInt(req.params.id));
    if(!product) return res.status(404).send('Product not found'); 
    if(!req.body.name||!req.body.categoryid){
        return res.status(400).send('Name or the category id not given')
    }
    product.categoryid = req.body.categoryid;
    product.name = req.body.name;
    res.send(product);
  })
//DELETE METHOD
  router.delete('/categories/:categoryid/products/:id',(req,res)=>{
    const categoryId = parseInt(req.params.categoryid);
    const categoryProducts = products.filter((p) => p.categoryid === categoryId);
    if (categoryProducts.length === 0) return res.status(404).send('Category not found or no products in this category');
    let product = categoryProducts.find(p=>p.id === parseInt(req.params.id));
    if(!product)res.status(404).send('Product not found'); 
    else res.status(204)
    const index = products.indexOf(product);
    products.splice(index,1);
    let product1 = products.find(p=>p.id === parseInt(req.params.id));
    res.send(product1);
  })
//POST METHOD
  router.post('/categories/:categoryid/products',(req,res)=>{
    let category = categories.find(p=>p.id === parseInt(req.params.categoryid));
    if(!category)res.status(404).send('category not found, cannot post product'); 

    if(!req.body.name){
        return res.status(400).send('Name given');
    }
    else res.status(201);
    p = parseInt(req.params.categoryid)
    const product = {
        id: products.length +1,
        categoryid:p,
        name: req.body.name
    };
    products.push(product);
    res.send(product);
    })
    
  //details
  router.get('/allcategories/allproducts/details', (req, res) => {
    return res.send(details);
  })

  router.get('/categories/:categoryid/products/:proddet/details/:id', (req, res) => {
    const categoryId = parseInt(req.params.categoryid);
    const categoryProducts = products.filter((p) => p.categoryid === categoryId);
    if (categoryProducts.length === 0) return res.status(404).send('Category not found or no products in this category');
    const productid = parseInt(req.params.proddet)
    var proddetails;
    for(let i =0;i<categoryProducts.length;i++)
    {
      if(categoryProducts[i].id===productid){
     proddetails = details.filter((d) => (d.id === parseInt(req.params.id) && d.prodid === productid));
  }
  }
    if(!proddetails.length) 
    return res.status(404).send('detail not found');
    res.send(proddetails);  
  })

  router.delete('/categories/:categoryid/products/:prodid/details/:id',(req,res)=>{
    let detail = details.find(p=>p.id === parseInt(req.params.id));
    if(!details)res.status(404).send('details not found'); 
    else res.status(204)
    const index = details.indexOf(detail);
    details.splice(index,1);
    let detail1 = details.find(p=>p.id === parseInt(req.params.id));
    res.send(detail1);
  })
  router.post('/categories/:categoryid/products/:prodid/details',(req,res)=>{
    const categoryId = parseInt(req.params.categoryid);
    const categoryProducts = products.filter((p) => p.categoryid === categoryId);
    let product = categoryProducts.find(p=>p.id === parseInt(req.params.prodid));
    if(!product)return res.status(404).send('category not found, cannot post product'); 

    if(!req.body.stockleft||!req.body.price){
        return res.status(400).send('stockleft or price not given');
    }
    else res.status(201);
    p = parseInt(req.params.prodid)
    const detail = {
        id: details.length +1,
        prodid:p,
        stockleft:req.body.stockleft,
        price: req.body.price    
      };
    details.push(detail);
    res.send(detail);
    })
    router.put('/categories/:categoryid/products/:prodid/details/:id',(req,res)=>{
      let detail = details.find(p=>p.id === parseInt(req.params.id));
      if(!detail) return res.status(404).send('details not found'); 
      if(!req.body.stockleft||!req.body.price){
        return res.status(400).send('stockleft or price not given');
    }
      detail.stockleft = req.body.stockleft;
      detail.price = req.body.price;
      res.send(detail);
  
  })
  module.exports=router;