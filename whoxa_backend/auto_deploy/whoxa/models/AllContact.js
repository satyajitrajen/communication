module.exports = (sequelize, DataTypes) => {
  const AllContact = sequelize.define("AllContact", {
    contact_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    phone_number: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    full_name: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    email_id: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    added_by_me: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  });

  AllContact.associate = function (models) {
    AllContact.belongsTo(models.User, {
      foreignKey: "user_id",
      onDelete: "cascade",
    });
  };

  return AllContact;
};
