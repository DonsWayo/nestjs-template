export default () => ({
    port: process.env.PORT,
    database: process.env.MONGO_URI
});