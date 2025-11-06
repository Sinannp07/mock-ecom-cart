const fs = require('fs');
const path = require('path');

const USE_FILE_PERSISTENCE = false; // Change to true if you want to save cart on server restart

const dataFile = path.join(__dirname, 'data.json');

const defaultState = {
  products: [
    { id: 1, name: "Product A", price: 199 },
    { id: 2, name: "Product B", price: 299 },
    { id: 3, name: "Product C", price: 149 },
    { id: 4, name: "Product D", price: 99 }
  ],
  cart: []
};

function load() {
  if (USE_FILE_PERSISTENCE && fs.existsSync(dataFile)) {
    try {
      return JSON.parse(fs.readFileSync(dataFile, 'utf8'));
    } catch {}
  }
  return JSON.parse(JSON.stringify(defaultState));
}

let state = load();

function save() {
  if (!USE_FILE_PERSISTENCE) return;
  fs.writeFileSync(dataFile, JSON.stringify(state, null, 2), 'utf8');
}

module.exports = {
  getProducts() { return state.products; },
  getCart() {
    return state.cart.map(c => {
      const p = state.products.find(x => x.id === c.productId);
      return { id: c.id, productId: c.productId, qty: c.qty, name: p.name, price: p.price };
    });
  },
  addToCart(productId, qty) {
    const existing = state.cart.find(c => c.productId === productId);
    if (existing) existing.qty += qty;
    else state.cart.push({ id: Date.now(), productId, qty });
    save();
  },
  removeCartItem(id) {
    state.cart = state.cart.filter(c => c.id !== Number(id));
    save();
  },
  clearCart() {
    state.cart = [];
    save();
  }
};
