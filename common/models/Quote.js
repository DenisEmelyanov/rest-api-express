const { DataTypes, Op } = require("sequelize");

const QuoteModel = {
    // id: {
    //     type: DataTypes.INTEGER,
    //     autoIncrement: true,
    //     primaryKey: true,
    // },
    ticker: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        primaryKey: true
    },
    open: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    close: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    high: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    low: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    volume: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
};

module.exports = {
    initialise: (sequelize) => {
        this.model = sequelize.define("quote", QuoteModel);
    },

    createQuote: (quote) => {
        console.log('save quote:');
        console.log(quote);
        return this.model.create(quote);
    },

    findQuote: (query) => {
        return this.model.findOne({
            where: query,
        });
    },

    updateQuote: (query, updatedValue) => {
        return this.model.update(updatedValue, {
            where: query,
        });
    },

    findAllQuotes: (specificDate, otherQueries = {}) => {
        return this.model.findAll({
            where: {
                ...otherQueries,
                date: {
                    [Op.eq]: specificDate // Use Op.eq for equality
                }
            }
        });
    },

    findAllQuotesBetweenDates: (startDate, endDate, otherQueries = {}) => {
        return this.model.findAll({
            where: {
                ...otherQueries, // Include other queries if needed
                date: {
                    [Op.between]: [startDate, endDate]
                }
            }
        });
    },

    // findAllTransactionTickers: (query) => {
    //     const transactions = this.model.findAll({
    //         attributes: ['ticker'],  // Select only the 'ticker' attribute
    //         distinct: true,         // Specify DISTINCT to retrieve unique values - DOES NOT WORK
    //         where: query             // Optional: Apply additional filtering using 'query'
    //     });

    //     return transactions;//.map(transaction => transaction.ticker);  // Extract ticker values
    // },

    // findAllTransactionGroups: (query) => {
    //     const transactions = this.model.findAll({
    //         attributes: ['group'],  // Select only the 'group' attribute
    //         distinct: true,         // Specify DISTINCT to retrieve unique values - DOES NOT WORK
    //         where: query             // Optional: Apply additional filtering using 'query'
    //     });

    //     return transactions;//.map(transaction => transaction.ticker);  // Extract ticker values
    // },

    // findAllTransactionYears: (query) => {
    //     const transactions = this.model.findAll({
    //         attributes: ['year'],  // Select only the 'ticker' attribute
    //         distinct: true,         // Specify DISTINCT to retrieve unique values - DOES NOT WORK
    //         where: query             // Optional: Apply additional filtering using 'query'
    //     });

    //     return transactions;//.map(transaction => transaction.ticker);  // Extract ticker values
    // },    

    deleteQuote: (query) => {
        return this.model.destroy({
            where: query
        });
    }
};