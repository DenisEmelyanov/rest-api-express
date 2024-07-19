const { DataTypes } = require("sequelize");

const TransactionModel = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  ticker: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  strike: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  expiration: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  side: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  premium: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  openDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  closeDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  }  
};

module.exports = {
    initialise: (sequelize) => {
      this.model = sequelize.define("transaction", TransactionModel);
    },
  
    createTransaction: (transaction) => {
      return this.model.create(transaction);
    },
  
    findTransaction: (query) => {
      return this.model.findOne({
        where: query,
      });
    },
  
    updateTransaction: (query, updatedValue) => {
      return this.model.update(updatedValue, {
        where: query,
      });
    },
  
    findAllTransactions: (query) => {
      return this.model.findAll({
        where: query
      });
    },
  
    deleteTransaction: (query) => {
      return this.model.destroy({
        where: query
      });
    }
  };