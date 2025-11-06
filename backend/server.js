const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
const PORT = 5000; 

app.use(cors());
app.use(express.json());

// GET /api/products
app.get('/api/products', (req, res) => {
  db.all('SELECT id, name, price FROM products', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST /api/cart {productId, qty}
app.post('/api/cart', (req, res) => {
  const { productId, qty } = req.body;
  if (!productId || !qty) return res.status(400).json({ error: 'productId and qty required' });

  db.get('SELECT id, qty FROM cart WHERE productId = ?', [productId], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (row) {
      const newQty = row.qty + qty;
      db.run('UPDATE cart SET qty = ? WHERE id = ?', [newQty, row.id], function (err2) {
        if (err2) return res.status(500).json({ error: err2.message });
        res.json({ id: row.id, productId, qty: newQty });
      });
    } else {
      db.run('INSERT INTO cart (productId, qty) VALUES (?, ?)', [productId, qty], function (err2) {
        if (err2) return res.status(500).json({ error: err2.message });
        res.json({ id: this.lastID, productId, qty });
      });
    }
  });
});

// DELETE /api/cart/:id
app.delete('/api/cart/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM cart WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, deleted: this.changes });
  });
});

// GET /api/cart
app.get('/api/cart', (req, res) => {
  const query = `
    SELECT c.id, c.productId, c.qty, p.name, p.price, (c.qty * p.price) AS lineTotal
    FROM cart c
    JOIN products p ON p.id = c.productId
  `;

  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    const total = rows.reduce((sum, row) => sum + row.lineTotal, 0);

    // ✅ Return consistent object
    res.json({
      items: rows,
      total: total
    });
  });
});



// POST /api/checkout
app.post("/api/checkout", (req, res) => {
  const { name, email, cartItems } = req.body;

  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  const receipt = {
    name,
    email,
    total,
    timestamp: new Date().toLocaleString()
  };

  db.run("DELETE FROM cart"); // Clear cart after order

  res.json(receipt);
});

// clear cart (dev)
app.post('/api/cart/clear', (req, res) => {
  db.run('DELETE FROM cart', [], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
