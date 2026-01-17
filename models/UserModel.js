const pool = require('../db/mysql_connect');

class User {
    static async findByEmail(email) {
        try {
            const [rows] = await pool.execute('SELECT id, email, password FROM users WHERE email = ?', [email]);
            return rows[0];
        } catch (error) {
            console.error('Error finding user by email:', error);
            throw error;
        }
    }

    static async create(email, password) {
        try {
            const [result] = await pool.execute('INSERT INTO users (email, password) VALUES (?, ?)', [email, password]);
            return { id: result.insertId, email };
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }
}

module.exports = User;
