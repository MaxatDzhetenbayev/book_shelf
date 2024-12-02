module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('books', 'rating', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn('books', 'rating');
  },
};
