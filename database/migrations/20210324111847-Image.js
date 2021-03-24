'use strict';


module.exports = {
    up: async(QueryInterface, Sequelize) =>{
        const {DataTypes} = Sequelize;
        await QueryInterface.createTable('images',{
            id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
            name:{type: DataTypes.STRING, allowNull: false},
            path:{type: DataTypes.STRING, allowNull: false},
            imageableType:{type: DataTypes.STRING, allowNull: false, field:'imageable_type'},
            imageableId:{type: DataTypes.INTEGER, allowNull: false, field:'imageable_id'},
            status: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: 0},
            createdAt: {type: DataTypes.DATE, allowNull: false, field:'created_at'},
            updatedAt: {type: DataTypes.DATE, allowNull: false, field:'updated_at'},
        });
        
    },

    down: async(QueryInterface)=>{
        await QueryInterface.dropTable('images');
    }
}
