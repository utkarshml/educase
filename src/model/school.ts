import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db';

export class School extends Model {
  school_id!: number;
  name!: string;
  address!: string;
  latitude!: number;
  longitude!: number;
}

School.init({
  school_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull : false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  latitude: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  longitude: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'school',
  timestamps : true
});