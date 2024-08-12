import express from 'express';
import saleOrderItemRouter from './routes/saleOrderItem';
import sequelize from './models/index';

const app = express();
app.use(express.json());
app.use('/api/sale-order-items', saleOrderItemRouter);

export { app };

const startServer = async () => {
  try {
    await sequelize.sync({ force: true });
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

if (require.main === module) {
  startServer();
}
