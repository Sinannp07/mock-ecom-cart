const db = require('./db');

const products = [
  { id: 1, name: "T-shirt", price: 499 },
  { id: 2, name: "Headphones", price: 1999 },
  { id: 3, name: "Shoes", price: 2499 },
  { id: 4, name: "Laptop Bag", price: 1299 },
  { id: 5, name: "Smart Watch", price: 3499 }
];

products.forEach(p => {
  db.run(`INSERT INTO products (id, name, price) VALUES (?, ?, ?)`,
    [p.id, p.name, p.price]
  );
});

console.log("Seed data inserted!");
