const { getDatabase } = require('../database');
const Product = require("./Product");

const COLLECTION_NAME = 'carts';

class Cart {
  static userId = 1;

  constructor() {
  }

  static async add(product) {
    const userId = this.userId;
    const db = getDatabase();

    let cart = await db.collection(COLLECTION_NAME).findOne({ userId });
    if (!cart) {
      cart = { userId, items: [] };
      await db.collection(COLLECTION_NAME).insertOne(cart);
    }

    const existingItemIndex = cart.items.findIndex(
      (item) => item.name === product.name
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += 1;
    } else {
      cart.items.push({ ...product, quantity: 1 });
    }

    await db.collection(COLLECTION_NAME).updateOne(
      { userId },
      { $set: { items: cart.items } }
    );
    return cart;
  }

  static async getItems() {
    const db = getDatabase();
    const cart = await db.collection(COLLECTION_NAME).findOne({ userId });
    return cart ? cart.items : [];
  }

  static async getProductsQuantity(userId) {
    const db = getDatabase();
    const cart = await db.collection(COLLECTION_NAME).findOne({ userId });
    if (!cart || !cart.items?.length) {
      return 0;
    }
    return cart.items.reduce((total, item) => total + (item.quantity || 0), 0);
  }

  static async getTotalPrice(userId) {
    const db = getDatabase();
    const cart = await db.collection(COLLECTION_NAME).findOne({ userId });
    if (!cart || !cart.items?.length) {
      return 0;
    }
    return cart.items.reduce((total, item) => {
      return total + (item.price || 0) * (item.quantity || 0);
    }, 0);
  }
  static async clearCart() {
    const db = getDatabase();
    await db.collection(COLLECTION_NAME).updateOne(
      { userId },
      { $set: { items: [] } }
    );
    return true;
  }
}

module.exports = Cart;
