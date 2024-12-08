module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('orders', 'term', {
      type: Sequelize.DATE,
      allowNull: false,
    });
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn('orders', 'term');
  },
};
