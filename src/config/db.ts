import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({
  path: path.join(path.resolve() , `.env`)
});
const sequelize = new Sequelize(process.env.DB_NAME ?? "" ,process.env.DB_USER ?? "", process.env.DB_PASSWORD,  {
  host: process.env.DB_HOST ,
  dialect: 'mysql',
  port : parseInt(process.env.DB_PORT ?? '5432')
});
export const isConneted = async () =>{

    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
  
}


export default sequelize