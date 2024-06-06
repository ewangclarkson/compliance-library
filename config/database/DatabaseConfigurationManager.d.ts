import { DataSource } from "typeorm";
export default class DatabaseConfigurationManager {
    private readonly dataSource;
    private static instance;
    private static configurations;
    private constructor();
    static getInstance(): DatabaseConfigurationManager;
    static setDatabaseConfigurationOnce(config: any): DatabaseConfigurationManager;
    getDataSource(): DataSource;
}
