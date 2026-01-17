const pool = require('../db/mysql_connect');

class Dealer {
    static async getAll() {
        try {
            const [rows] = await pool.execute('SELECT id, bayi_adi, sehir_id, satis_miktari, kar_miktari, durum FROM bayiler');
            return rows;
        } catch (error) {
            console.error('Error fetching all dealers:', error);
            throw error;
        }
    }

    static async getById(id) {
        try {
            const [rows] = await pool.execute('SELECT id, bayi_adi, sehir_id, satis_miktari, kar_miktari, durum FROM bayiler WHERE id = ?', [id]);
            return rows[0];
        } catch (error) {
            console.error(`Error fetching dealer with id ${id}:`, error);
            throw error;
        }
    }

    // Example of adding a new dealer (adjust fields as necessary)
    static async create(dealerData) {
        const { bayi_adi, sehir_id, satis_miktari, kar_miktari, durum } = dealerData;
        try {
            const [result] = await pool.execute(
                'INSERT INTO bayiler (bayi_adi, sehir_id, satis_miktari, kar_miktari, durum) VALUES (?, ?, ?, ?, ?)',
                [bayi_adi, sehir_id, satis_miktari, kar_miktari, durum]
            );
            return { id: result.insertId, ...dealerData };
        } catch (error) {
            console.error('Error creating dealer:', error);
            throw error;
        }
    }

    // Example of updating a dealer
    static async update(id, dealerData) {
        const { bayi_adi, sehir_id, satis_miktari, kar_miktari, durum } = dealerData;
        try {
            const [result] = await pool.execute(
                'UPDATE bayiler SET bayi_adi = ?, sehir_id = ?, satis_miktari = ?, kar_miktari = ?, durum = ? WHERE id = ?',
                [bayi_adi, sehir_id, satis_miktari, kar_miktari, durum, id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error(`Error updating dealer with id ${id}:`, error);
            throw error;
        }
    }

    // Example of deleting a dealer
    static async delete(id) {
        try {
            const [result] = await pool.execute('DELETE FROM bayiler WHERE id = ?', [id]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error(`Error deleting dealer with id ${id}:`, error);
            throw error;
        }
    }
}

module.exports = Dealer;
