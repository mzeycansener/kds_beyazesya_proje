const pool = require('../db/mysql_connect');

class SaleProduct {
    static async getAll() {
        try {
            const [rows] = await pool.execute('SELECT id, name, price, stok_adedi, "Satis" as status FROM satis_urunleri');
            return rows;
        } catch (error) {
            console.error('Error fetching all sale products:', error);
            throw error;
        }
    }

    static async getById(id) {
        try {
            const [rows] = await pool.execute('SELECT id, name, price, stok_adedi, "Satis" as status FROM satis_urunleri WHERE id = ?', [id]);
            return rows[0];
        } catch (error) {
            console.error(`Error fetching sale product with id ${id}:`, error);
            throw error;
        }
    }

    static async updateStock(id, newStock, connection = pool) {
        try {
            const [result] = await (connection || pool).execute('UPDATE satis_urunleri SET stok_adedi = ? WHERE id = ?', [newStock, id]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error(`Error updating stock for sale product with id ${id}:`, error);
            throw error;
        }
    }

    static async getStockForUpdate(id, connection) {
        try {
            const [rows] = await connection.execute('SELECT stok_adedi FROM satis_urunleri WHERE id = ? FOR UPDATE', [id]);
            return rows[0] ? rows[0].stok_adedi : null;
        } catch (error) {
            console.error(`Error getting stock for update for sale product with id ${id}:`, error);
            throw error;
        }
    }

    // Add other CRUD operations if necessary, assuming name, price for SaleProduct
    static async create(productData) {
        const { name, price, stok_adedi } = productData;
        try {
            const [result] = await pool.execute(
                'INSERT INTO satis_urunleri (name, price, stok_adedi) VALUES (?, ?, ?)',
                [name, price, stok_adedi]
            );
            return { id: result.insertId, ...productData };
        } catch (error) {
            console.error('Error creating sale product:', error);
            throw error;
        }
    }

    static async update(id, productData) {
        const { name, price, stok_adedi } = productData;
        try {
            const [result] = await pool.execute(
                'UPDATE satis_urunleri SET name = ?, price = ?, stok_adedi = ? WHERE id = ?',
                [name, price, stok_adedi, id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error(`Error updating sale product with id ${id}:`, error);
            throw error;
        }
    }

    static async delete(id) {
        try {
            const [result] = await pool.execute('DELETE FROM satis_urunleri WHERE id = ?', [id]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error(`Error deleting sale product with id ${id}:`, error);
            throw error;
        }
    }
}

module.exports = SaleProduct;
