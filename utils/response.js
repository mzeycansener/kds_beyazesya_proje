class Response {
    constructor(data = null, message = null) {
        this.data = data;
        this.message = message;
    }

    success(res) {
        return res.status(200).json({
            success: true,
            data: this.data,
            message: this.message ?? 'İşlem başarılı.'
        });
    }

    error(res) {
        return res.status(res.statusCode || 500).json({
            success: false,
            data: this.data,
            message: this.message ?? 'İşlem başarısız.'
        });
    }
}

module.exports = Response;
