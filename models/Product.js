const pool = require('../db/mysql_connect');

class Product {
    static async getAll() {
        try {
            const [rows] = await pool.execute('SELECT * FROM products');
            return rows;
        } catch (error) {
            console.error('Error fetching all products:', error);
            throw error;
        }
    }

    static async getById(id) {
        try {
            const [rows] = await pool.execute('SELECT * FROM products WHERE id = ?', [id]);
            return rows[0]; // Assuming id is unique, return the first row
        } catch (error) {
            console.error(`Error fetching product with id ${id}:`, error);
            throw error;
        }
    }

    static async create(productData) {
        const { name, description, price, stock, imageUrl } = productData;
        try {
            const [result] = await pool.execute(
                'INSERT INTO products (name, description, price, stock, imageUrl) VALUES (?, ?, ?, ?, ?)',
                [name, description, price, stock, imageUrl]
            );
            return { id: result.insertId, ...productData };
        } catch (error) {
            console.error('Error creating product:', error);
            throw error;
        }
    }

    static async update(id, productData) {
        const { name, description, price, stock, imageUrl } = productData;
        try {
            const [result] = await pool.execute(
                'UPDATE products SET name = ?, description = ?, price = ?, stock = ?, imageUrl = ? WHERE id = ?',
                [name, description, price, stock, imageUrl, id]
            );
            return result.affectedRows > 0; // Returns true if product was updated
        } catch (error) {
            console.error(`Error updating product with id ${id}:`, error);
            throw error;
        }
    }

    static async delete(id) {
        try {
            const [result] = await pool.execute('DELETE FROM products WHERE id = ?', [id]);
            return result.affectedRows > 0; // Returns true if product was deleted
        } catch (error) {
            console.error(`Error deleting product with id ${id}:`, error);
            throw error;
        }
    }
}

module.exports = Product;
