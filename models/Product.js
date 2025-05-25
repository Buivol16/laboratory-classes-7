const { getDatabase } = require('../database');

const COLLECTION_NAME = 'products';

class Product {
  constructor(name, description, price) {
    this.name = name;
    this.description = description;
    this.price = price;
  }

  static async getAll() {
    const db = getDatabase();
    const result =  await (db.collection(COLLECTION_NAME).find({}).toArray());
    return result;
  }

  static async add(product) {
    const db = getDatabase();
    const existing = await db.collection(COLLECTION_NAME).findOne({ name: product.name });
    if (existing) {
      throw new Error('Product with this name already exists.');
    }
    const result = await db.collection(COLLECTION_NAME).insertOne({
      name: product.name,
      description: product.description,
      price: product.price,
    });
  }

  static async findByName(name) {
    const db = getDatabase();
    const result = await (db.collection(COLLECTION_NAME).findOne({ name }));
    return result;
  }

  static async deleteByName(name) {
    const db = getDatabase();
    const result = await db.collection(COLLECTION_NAME).deleteOne({ name });
    return result.deletedCount > 0;
  }

  static async getLast() {
    const db = getDatabase();
    const lastProduct = await db
      .collection(COLLECTION_NAME)
      .find({})
      .sort({ _id: -1 })
      .limit(1)
      .toArray();

    return lastProduct[0] || undefined;
  }
}

module.exports = Product;
