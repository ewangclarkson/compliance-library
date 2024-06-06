"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
//singleton design pattern
class DatabaseConfigurationManager {
    constructor() {
        this.dataSource = new typeorm_1.DataSource(DatabaseConfigurationManager.configurations);
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new DatabaseConfigurationManager();
        }
        return this.instance;
    }
    static setDatabaseConfigurationOnce(config) {
        if (!this.configurations) {
            this.configurations = config;
            this.getInstance();
        }
        return this.instance; //builder
    }
    getDataSource() {
        return this.dataSource;
    }
}
exports.default = DatabaseConfigurationManager;
//# sourceMappingURL=DatabaseConfigurationManager.js.map