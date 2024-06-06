import {DataSource, DataSourceOptions} from "typeorm"

//singleton design pattern
export default class DatabaseConfigurationManager {
    private readonly dataSource: DataSource;
    private static instance: DatabaseConfigurationManager;
    private static configurations: DataSourceOptions;

    private constructor() {
        this.dataSource = new DataSource(DatabaseConfigurationManager.configurations);
    }

    static getInstance(): DatabaseConfigurationManager {
        if (!this.instance) {
            this.instance = new DatabaseConfigurationManager();
        }
        return this.instance;
    }

    static setDatabaseConfigurationOnce(config: any): DatabaseConfigurationManager {
        if (!this.configurations) {
            this.configurations = config;
            this.getInstance();
        }
        return this.instance;//builder
    }

    getDataSource(): DataSource {
        return this.dataSource;
    }

}