require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
    console.log(`🚀 Student Service running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});
