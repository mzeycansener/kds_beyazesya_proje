const pool = require('../db/mysql_connect');

class Urun {
    static async getAll() {
        try {
            const [rows] = await pool.execute('SELECT id, urun_adi, tur FROM urunler');
            return rows;
        } catch (error) {
            console.error('Error fetching all urunler:', error);
            throw error;
        }
    }

    static async getById(id) {
        try {
            const [rows] = await pool.execute('SELECT id, urun_adi, tur FROM urunler WHERE id = ?', [id]);
            return rows[0];
        } catch (error) {
            console.error(`Error fetching urun with id ${id}:`, error);
            throw error;
        }
    }

    static async create(urunData) {
        const { urun_adi, tur } = urunData;
        try {
            const [result] = await pool.execute(
                'INSERT INTO urunler (urun_adi, tur) VALUES (?, ?)',
                [urun_adi, tur]
            );
            return { id: result.insertId, ...urunData };
        } catch (error) {
            console.error('Error creating urun:', error);
            throw error;
        }
    }

    static async update(id, urunData) {
        const { urun_adi, tur } = urunData;
        try {
            const [result] = await pool.execute(
                'UPDATE urunler SET urun_adi = ?, tur = ? WHERE id = ?',
                [urun_adi, tur, id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error(`Error updating urun with id ${id}:`, error);
            throw error;
        }
    }

    static async delete(id) {
        try {
            const [result] = await pool.execute('DELETE FROM urunler WHERE id = ?', [id]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error(`Error deleting urun with id ${id}:`, error);
            throw error;
        }
    }
}

module.exports = Urun;
