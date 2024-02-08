const { Op } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const ShopperVisit = sequelize.define(
    'ShopperVisit',
    {
      hNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      visitTime: {
        type: DataTypes.DATE,
        allowNull: false,
        primaryKey: true,
      },
    },
    {
      tableName: 'shopperVisits',
      timestamps: true,
      createdAt: false,
      timezone: 'America/Chicago',
    },
  );

  // Associations
  ShopperVisit.associate = (models) => {
    ShopperVisit.belongsTo(models.Shopper, { foreignKey: 'hNumber' });
  };

  // Makes a new entry logging when a shopper visits
  ShopperVisit.createVisit = async function (hNumber) {
    const centralTime = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Chicago',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false, // Use 24-hour format
    }).format(new Date());

    const result = await ShopperVisit.create({
      hNumber: hNumber,
      visitTime: centralTime,
    });
    return result;
  };

  // Checks if shopper has been in the past two weeks
  // @return [Boolean] true if they have been twice this week, false if not
  ShopperVisit.isShopperAtWeekLimit = async function (hNumber) {
    const currentDate = new Date();

    // Calculate the start of the current week (Sunday)
    const startOfWeek = new Date(currentDate);
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

    // Calculate the end of the current week (Saturday)
    const endOfWeek = new Date(currentDate);
    endOfWeek.setHours(23, 59, 59, 999);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const visitCount = await ShopperVisit.count({
      where: {
        hNumber: hNumber,
        visitTime: {
          [Op.between]: [startOfWeek, endOfWeek],
        },
      },
    });

    return visitCount >= 2;
  };

  return ShopperVisit;
};
