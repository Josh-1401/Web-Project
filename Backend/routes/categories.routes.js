const express = require('express');
const router = express.Router();
var mysql = require('mysql');
const verifyRoles = require('../middleware/verifyRoles');
const ROLES_LIST = require('../config/roles_list');

const pool=mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'node_project'
})

// GET all categories
router.get('/categories', (req, res)=> {
  pool.getConnection(function(err, connection) {
    if (err) throw err;
    connection.query('SELECT * FROM categories', function(err, result) {
      if (err) throw err;
      res.send(result);
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
      res.send(result)
      //res.status(201).send({ id: result.insertId, name });
      connection.release();
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
      res.send({ id: categoryId, name });
      connection.release();
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
      }
      res.sendStatus(204);
      connection.release();
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
      res.send(result);
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
      res.send(result[0]);
      connection.release();
    });
  });
});

// PUT - Update a product by ID within a category
router.put('/categories/:categoryid/products/:id',verifyRoles(ROLES_LIST.Admin,ROLES_LIST.Editor), function(req, res) {
  const categoryId = req.params.categoryid;
  const productId = req.params.id;
  const { name, categoryid } = req.body;

  if (!name || !categoryid) {
    return res.status(400).send('Name or category ID not provided');
  }

  pool.getConnection(function(err, connection) {
    if (err) throw err;
    connection.query('UPDATE products SET name = ?, categoryid = ? WHERE categoryid = ? AND id = ?', [name, categoryid, categoryId, productId], function(err, result) {
      if (err) throw err;
      if (result.affectedRows === 0) {
        return res.status(404).send('Product not found');
      }
      res.send({ id: productId, categoryid, name });
      connection.release();
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
      res.sendStatus(204);
      connection.release();
    });
  });
});

// POST - Create a product within a category
router.post('/categories/:categoryid/products',verifyRoles(ROLES_LIST.Admin), function(req, res) {
  const categoryId = req.params.categoryid;
  const { name } = req.body;

  if (!name) {
    return res.status(400).send('Name not provided');
  }

  pool.getConnection(function(err, connection) {
    if (err) throw err;
    connection.query('INSERT INTO products (categoryid, name) VALUES (?, ?)', [categoryId, name], function(err, result) {
      if (err) throw err;
      res.status(201).send({ id: result.insertId, categoryid: categoryId, name });
      connection.release();
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
        return res.status(404).send('Review not found');
      }
      res.send(result);
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

  pool.getConnection(function(err, connection) {
    if (err) throw err;
    connection.query('DELETE FROM product_detail WHERE id = ?', [reviewId], function(err, result) {
      if (err) throw err;
      if (result.affectedRows === 0) {
        return res.status(404).send('Review not found');
      }
      res.sendStatus(204);
      connection.release();
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
    return res.status(400).send('Review content not provided');
  }

  pool.getConnection(function(err, connection) {
    if (err) throw err;
    const detail = {
      prodid: productid,
      review: review
    };
    connection.query('INSERT INTO product_detail SET ?', detail, function(err, result) {
      if (err) throw err;
      res.status(201).send({ id: result.insertId, prodid: productid, review: review });
      connection.release();
    });
  });
});

// PUT - Update a review for a specific product by review ID
router.put('/categories/:categoryid/products/:prodid/reviews/:id', function(req, res) {
  const reviewId = parseInt(req.params.id);

  // Validate request body
  const { review } = req.body;
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
      res.send({ id: reviewId, review });
      connection.release();
    });
  });
});


module.exports = router;
