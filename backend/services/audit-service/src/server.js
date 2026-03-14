require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 5005;

app.listen(PORT, () => {
    console.log(`🚀 Audit Service running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    console.log(`📚 Swagger docs: http://localhost:${PORT}/api-docs`);
});
