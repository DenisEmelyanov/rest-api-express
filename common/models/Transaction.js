const { DataTypes, Op } = require("sequelize");

const TransactionModel = {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    portfolio: {
        type: DataTypes.STRING,
        allowNull: false
    },
    group: {
        type: DataTypes.STRING,
        allowNull: true
    },
    ticker: {
        type: DataTypes.STRING,
        allowNull: true
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    strike: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    expiration: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    openSide: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    closeSide: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    premium: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    openAmount: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    closeAmount: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    openDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    closeDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    year: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    assigned: {
        type: DataTypes.BOOLEAN,
        allowNull: false
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

    findAllTransactionsByMonth: (year, month, otherQueries = {}) => {
        const startDate = new Date(year, month - 1, 1); // Month is 0-indexed
        const endDate = new Date(year, month, 0); // Day 0 of next month gives last day of current month
        console.log('findAllTransactionsByMonth > start date: ' + startDate + ' end date: ' + endDate);
        const query = {
            [Op.or]: {
                openDate: { [Op.between]: [startDate, endDate] },
                closeDate: { [Op.between]: [startDate, endDate] },
            },
            ...otherQueries // Spread the other queries *outside* the OR
        };
    
        return this.model.findAll({
            where: query,
            distinct: true
        });
    },

    findAllTransactionsByYear: (year,otherQueries = {}) => {
        const startDate = new Date(year, 0, 1); // Month is 0-indexed
        const endDate = new Date(year, 11, 31); // Day 0 of next month gives last day of current month
        console.log('findAllTransactionsByMonth > start date: ' + startDate + ' end date: ' + endDate);
        const query = {
            [Op.or]: {
                openDate: { [Op.between]: [startDate, endDate] },
                closeDate: { [Op.between]: [startDate, endDate] },
            },
            ...otherQueries // Spread the other queries *outside* the OR
        };
    
        return this.model.findAll({
            where: query,
            distinct: true
        });
    },

    findAllTransactionTickers: (query) => {
        const transactions = this.model.findAll({
            attributes: ['ticker'],  // Select only the 'ticker' attribute
            distinct: true,         // Specify DISTINCT to retrieve unique values - DOES NOT WORK
            where: query             // Optional: Apply additional filtering using 'query'
        });

        return transactions;//.map(transaction => transaction.ticker);  // Extract ticker values
    },

    findAllTransactionGroups: (query) => {
        const transactions = this.model.findAll({
            attributes: ['group'],  // Select only the 'group' attribute
            distinct: true,         // Specify DISTINCT to retrieve unique values - DOES NOT WORK
            where: query             // Optional: Apply additional filtering using 'query'
        });

        return transactions;//.map(transaction => transaction.ticker);  // Extract ticker values
    },

    findAllTransactionYears: (query) => {
        const transactions = this.model.findAll({
            attributes: ['year'],  // Select only the 'ticker' attribute
            distinct: true,         // Specify DISTINCT to retrieve unique values - DOES NOT WORK
            where: query             // Optional: Apply additional filtering using 'query'
        });

        return transactions;//.map(transaction => transaction.ticker);  // Extract ticker values
    },    

    deleteTransaction: (query) => {
        return this.model.destroy({
            where: query
        });
    }
};