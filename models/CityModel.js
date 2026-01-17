const pool = require('../db/mysql_connect');

class City {
    static async getAll() {
        try {
            const [rows] = await pool.execute('SELECT id, sehir_adi FROM sehirler');
            return rows;
        } catch (error) {
            console.error('Error fetching all cities:', error);
            throw error;
        }
    }

    static async getById(id) {
        try {
            const [rows] = await pool.execute('SELECT id, sehir_adi FROM sehirler WHERE id = ?', [id]);
            return rows[0];
        } catch (error) {
            console.error(`Error fetching city with id ${id}:`, error);
            throw error;
        }
    }

    // Example of adding a new city
    static async create(cityName) {
        try {
            const [result] = await pool.execute('INSERT INTO sehirler (sehir_adi) VALUES (?)', [cityName]);
            return { id: result.insertId, sehir_adi: cityName };
        } catch (error) {
            console.error('Error creating city:', error);
            throw error;
        }
    }

    // Example of updating a city
    static async update(id, cityName) {
        try {
            const [result] = await pool.execute('UPDATE sehirler SET sehir_adi = ? WHERE id = ?', [cityName, id]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error(`Error updating city with id ${id}:`, error);
            throw error;
        }
    }

    // Example of deleting a city
    static async delete(id) {
        try {
            const [result] = await pool.execute('DELETE FROM sehirler WHERE id = ?', [id]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error(`Error deleting city with id ${id}:`, error);
            throw error;
        }
    }
}

module.exports = City;
