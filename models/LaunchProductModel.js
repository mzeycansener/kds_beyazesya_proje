const pool = require('../db/mysql_connect');

class LaunchProduct {
    static async getAll() {
        try {
            const [rows] = await pool.execute('SELECT id, name, description, "Lansman" as status FROM lansman_urunleri');
            return rows;
        } catch (error) {
            console.error('Error fetching all launch products:', error);
            throw error;
        }
    }

    static async getById(id) {
        try {
            const [rows] = await pool.execute('SELECT id, name, description, "Lansman" as status FROM lansman_urunleri WHERE id = ?', [id]);
            return rows[0];
        } catch (error) {
            console.error(`Error fetching launch product with id ${id}:`, error);
            throw error;
        }
    }

    // Add other CRUD operations if necessary, assuming name, description for LaunchProduct
    static async create(productData) {
        const { name, description } = productData;
        try {
            const [result] = await pool.execute(
                'INSERT INTO lansman_urunleri (name, description) VALUES (?, ?)',
                [name, description]
            );
            return { id: result.insertId, ...productData };
        } catch (error) {
            console.error('Error creating launch product:', error);
            throw error;
        }
    }

    static async update(id, productData) {
        const { name, description } = productData;
        try {
            const [result] = await pool.execute(
                'UPDATE lansman_urunleri SET name = ?, description = ? WHERE id = ?',
                [name, description, id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error(`Error updating launch product with id ${id}:`, error);
            throw error;
        }
    }

    static async delete(id) {
        try {
            const [result] = await pool.execute('DELETE FROM lansman_urunleri WHERE id = ?', [id]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error(`Error deleting launch product with id ${id}:`, error);
            throw error;
        }
    }
}

module.exports = LaunchProduct;
