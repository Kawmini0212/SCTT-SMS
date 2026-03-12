require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 5004;

app.listen(PORT, () => {
    console.log(`🚀 Enrollment Service running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    console.log(`📚 Swagger docs: http://localhost:${PORT}/api-docs`);
});
