module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('orders', 'status', {
      type: Sequelize.ENUM(
        'waiting',
        'not_available',
        'ready',
        'delivered',
        'expired',
        'returned',
      ),
      allowNull: false,
    });

    await queryInterface.sequelize.query(`
      ALTER TABLE orders ALTER COLUMN status SET DEFAULT 'waiting';
    `);
  },
  down: async (queryInterface) => {
    await queryInterface.changeColumn('orders', 'status', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.sequelize.query(`
      ALTER TABLE orders ALTER COLUMN status DROP DEFAULT;
    `);
  },
};
