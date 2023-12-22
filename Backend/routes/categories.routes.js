const express = require('express');
const router = express.Router();
var mysql = require('mysql');
const verifyRoles = require('../middleware/verifyRoles');
const ROLES_LIST = require('../config/roles_list');
const methodOverride = require('method-override');
router.use(methodOverride('_method'));
const fetchrole = require('../middleware/FetchUser');

const pool=mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'web_project'
})
//router.use(fetchrole);

// GET all categories
router.get('/categories',verifyRoles(ROLES_LIST.User), (req, res)=> {
  
  const role = req.role;
  console.log(role);
  pool.getConnection(function(err, connection) {
    if (err) throw err;
    connection.query('SELECT * FROM categories', function(err, result) {
      if (err) throw err;
      //res.send(result);
      res.render("Home/category/categories", {title: "Categories", categories: result,isAdmin: res.locals.isAdmin});

      connection.release();
    });
  });
});

// GET a specific category by ID
router.get('/categories/:id', (req, res)=> {
  const categoryId = req.params.id;
  pool.getConnection(function(err, connection) {
    if (err) throw err;
    connection.query('SELECT * FROM categories WHERE Categoryid = ?', [categoryId], function(err, result) {
      if (err) throw err;
      if (result.length === 0) {
        return res.status(404).send('Category not found');
      }
      res.send(result[0]);
      connection.release();
    });
  });
});
router.use(methodOverride('_method'));


// POST - Create a new category
router.post('/categories',verifyRoles(ROLES_LIST.Admin), (req, res)=> {
  const params = req.body;

  if (!params) {
    return res.status(400).send('Name not provided');
  }

  pool.getConnection(function(err, connection) {
    if (err) throw err;
    connection.query('INSERT INTO categories SET ?', params, (err, result)=> {
      if (err) throw err;
      connection.query('SELECT * FROM categories', function(err, result) {
        if (err) throw err;
        //res.send(result);
        res.render("Home/category/categories", {title: "Categories", categories: result,isAdmin: res.locals.isAdmin});
  
        connection.release();
      });
    });
  });
});

// PUT - Update a category by ID
router.put('/categories/:id',verifyRoles(ROLES_LIST.Admin,ROLES_LIST.Editor), (req, res)=> {
  const categoryId = req.params.id;
  const { name } = req.body;

  if (!name) {
    return res.status(400).send('Name not provided');
  }

  pool.getConnection(function(err, connection) {
    if (err) throw err;
    connection.query('UPDATE categories SET name = ? WHERE Categoryid = ?', [name, categoryId], function(err, result) {
      if (err) throw err;
      if (result.affectedRows === 0) {
        return res.status(404).send('Category not found');
      }
      connection.query('SELECT * FROM categories', function(err, result) {
        if (err) throw err;
        //res.send(result);
        res.render("Home/category/categories", {title: "Categories", categories: result,isAdmin: res.locals.isAdmin});
  
        connection.release();
      });
    });
  });
});

// DELETE - Delete a category by ID
router.delete('/categories/:id',verifyRoles(ROLES_LIST.Admin), (req, res)=> {
  const categoryId = req.params.id;

  pool.getConnection(function(err, connection) {
    if (err) throw err;
    connection.query('DELETE FROM categories WHERE Categoryid = ?', [categoryId], function(err, result) {
      if (err) throw err;
      if (result.affectedRows === 0) {
        return res.status(404).send('Category not found');
      }  connection.query('SELECT * FROM categories', function(err, result) {
        if (err) throw err;
        //res.send(result);
        res.redirect('/categories')
        //res.render("Home/category/categories", {title: "Categories", categories: result,isAdmin: res.locals.isAdmin});
  
        connection.release();
      });
    });
    });
  });


// GET products by category ID
router.get('/categories/:categoryid/products', function(req, res) {
  const categoryId = req.params.categoryid;
  pool.getConnection(function(err, connection) {
    if (err) throw err;
    connection.query('SELECT * FROM products WHERE categoryid = ?', [categoryId], function(err, result) {
      if (err) throw err;
      if (result.length === 0) {
        return res.status(404).send('Category not found or no products in this category');
      }
      //res.send(result);
      res.render("Home/category/products", {title: "Products", products: result});
      connection.release();
    });
  });
});

// GET a specific product by ID within a category
router.get('/categories/:categoryid/products/:id', function(req, res) {
  const categoryId = req.params.categoryid;
  const productId = req.params.id;
  pool.getConnection(function(err, connection) {
    if (err) throw err;
    connection.query('SELECT * FROM products WHERE categoryid = ? AND id = ?', [categoryId, productId], function(err, result) {
      if (err) throw err;
      if (result.length === 0) {
        return res.status(404).send('Product not found');
      }
      res.render("Home/category/product", {title: "Product", product: result});
      connection.release();
    });
  });
});

// PUT - Update a product by ID within a category

router.put('/categories/:categoryid/products/:id', verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), function (req, res) {
  const categoryId = req.params.categoryid;
  const productId = req.params.id;
  const name = req.body.name;
  const image = req.body.image;

  if (!name) {
      return res.status(400).send('Name or category ID not provided');
  }

  pool.getConnection(function (err, connection) {
      if (err) throw err;
      connection.query('UPDATE products SET name = ?, categoryid = ?, image = ? WHERE categoryid = ? AND id = ?', [name, categoryId, image, categoryId, productId], function (err, result) {
          if (err) throw err;
          if (result.affectedRows === 0) {
              return res.status(404).send('Product not found');
          }
          
          // Fetch the updated products after the update
          connection.query('SELECT * FROM products WHERE categoryid = ?', [categoryId], function (err, updatedProducts) {
              if (err) throw err;

              // Render the updated products in the EJS file
              res.render("Home/category/products", { title: "Products", products: updatedProducts });
              connection.release();
          });
      });
  });
});

// DELETE - Delete a product by ID within a category
router.delete('/categories/:categoryid/products/:id',verifyRoles(ROLES_LIST.Admin), function(req, res) {
  const categoryId = req.params.categoryid;
  const productId = req.params.id;

  pool.getConnection(function(err, connection) {
    if (err) throw err;
    connection.query('DELETE FROM products WHERE categoryid = ? AND id = ?', [categoryId, productId], function(err, result) {
      if (err) throw err;
      if (result.affectedRows === 0) {
        return res.status(404).send('Product not found');
      }
      connection.query('SELECT * FROM products WHERE categoryid = ?', [categoryId], function(err, result) {
        if (err) throw err;
        if (result.length === 0) {
          return res.status(404).send('Category not found or no products in this category');
        }
        //res.send(result);
        res.render("Home/category/products", {title: "Products", products: result});
        connection.release();
    });
  });
});
});
// POST - Create a product within a category
router.post('/categories/:categoryid/products',verifyRoles(ROLES_LIST.Admin), function(req, res) {
  const categoryId = req.params.categoryid;
  const  name  = req.body.name;
  const image = req.body.image
  

  if (!name) {
    return res.status(400).send('Name not provided');
  }

  pool.getConnection(function(err, connection) {
    if (err) throw err;
    connection.query('INSERT INTO products (categoryid, name,image) VALUES (?,?, ?)', [categoryId, name, image], function(err, result) {
      if (err) throw err;
      connection.query('SELECT * FROM products WHERE categoryid = ?', [categoryId], function(err, result) {
        if (err) throw err;
        if (result.length === 0) {
          return res.status(404).send('Category not found or no products in this category');
        }
        //res.send(result);
        res.render("Home/category/products", {title: "Products", products: result});
        connection.release();
    });
  });
});
});
//Reviews
router.get('/categories/:categoryid/products/:proddet/reviews', function(req, res) {
  const categoryId = parseInt(req.params.categoryid);
  const productid = parseInt(req.params.proddet);

  pool.getConnection(function(err, connection) {
    if (err) throw err;
    connection.query('SELECT * FROM product_detail WHERE prodid = ?', [productid], function(err, result) {
      if (err) throw err;
      if (result.length === 0) {
        //return res.status(404).send('Review not found');
      }
      //res.send(result);
      res.render("Home/category/review", {title: "Reviews", reviews: result,categoryid:categoryId,prodid:productid});
      connection.release();
    });
  });
});


// GET reviews for a specific product by product ID
router.get('/categories/:categoryid/products/:proddet/reviews/:id', function(req, res) {
  const categoryId = parseInt(req.params.categoryid);
  const productid = parseInt(req.params.proddet);
  const reviewId = parseInt(req.params.id);

  pool.getConnection(function(err, connection) {
    if (err) throw err;
    connection.query('SELECT * FROM product_detail WHERE prodid = ? AND id = ?', [productid, reviewId], function(err, result) {
      if (err) throw err;
      if (result.length === 0) {
        return res.status(404).send('Review not found');
      }
      res.send(result[0]);
      connection.release();
    });
  });
});

// DELETE a review for a specific product by review ID
router.delete('/categories/:categoryid/products/:prodid/reviews/:id',verifyRoles(ROLES_LIST.Admin,ROLES_LIST.User), function(req, res) {
  const reviewId = parseInt(req.params.id);
  const categoryId = parseInt(req.params.categoryid);
  const productid = parseInt(req.params.prodid);
  pool.getConnection(function(err, connection) {
    if (err) throw err;
    connection.query('DELETE FROM product_detail WHERE id = ?', [reviewId], function(err, result) {
      if (err) throw err;
      if (result.affectedRows === 0) {
        return res.status(404).send('Review not found');
      }
      connection.query('SELECT * FROM product_detail WHERE prodid = ?', [productid], function(err, result) {
        if (err) throw err;
        if (result.length === 0) {
          //return res.status(404).send('Review not found');
        }
        //res.send(result);
        res.render("Home/category/review", {title: "Reviews", reviews: result,categoryid:categoryId,prodid:productid});
        connection.release();
    });
  });
});
});

// POST - Create a review for a specific product
router.post('/categories/:categoryid/products/:prodid/reviews', function(req, res) {
  const categoryId = parseInt(req.params.categoryid);
  const productid = parseInt(req.params.prodid);

  // Validate request body
  const { review } = req.body;
  if (!review) {
    //return res.status(400).send('Review content not provided');
  }

  pool.getConnection(function(err, connection) {
    if (err) throw err;
    const detail = {
      prodid: productid,
      review: review
    };
    connection.query('INSERT INTO product_detail SET ?', detail, function(err, result) {
      if (err) throw err;
      res.redirect('/categories/' + categoryId + '/products/' + productid + '?message=Review added successfully!');

      //res.status(201).send({ id: result.insertId, prodid: productid, review: review });
      connection.release();
    });
  });
});

// PUT - Update a review for a specific product by review ID
router.put('/categories/:categoryid/products/:prodid/reviews/:id', function(req, res) {
  const reviewId = parseInt(req.params.id);
  const productid = parseInt(req.params.prodid);
  const categoryId = parseInt(req.params.categoryid);

  // Validate request body
  const  review  = req.body.name;
  if (!review) {
    return res.status(400).send('Review content not provided');
  }

  pool.getConnection(function(err, connection) {
    if (err) throw err;
    connection.query('UPDATE product_detail SET review = ? WHERE id = ?', [review, reviewId], function(err, result) {
      if (err) throw err;
      if (result.affectedRows === 0) {
        return res.status(404).send('Review not found');
      }
      connection.query('SELECT * FROM product_detail WHERE prodid = ?', [productid], function(err, result) {
        if (err) throw err;
        if (result.length === 0) {
          //return res.status(404).send('Review not found');
        }
        //res.send(result);
        res.render("Home/category/review", {title: "Reviews", reviews: result,categoryid:categoryId,prodid:productid});
        connection.release();
    });
  });
});
});


module.exports = router;
