module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.updateColumn('orders', 'status', {
      type: Sequelize.ENUM(
        'waiting',
        'not_available',
        'ready',
        'delivered',
        'expired',
        'returned',
      ),
      allowNull: false,
      defaultValue: 'pending',
    });
  },
  down: async (queryInterface) => {
    await queryInterface.updateColumn('orders', 'status', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
};
