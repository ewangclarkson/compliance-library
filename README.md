# Security, Kafka-Compliance, Logging,Validation and Persistent Library

This library provides a comprehensive set of functionalities to address common requirements in modern web applications, including:

1. **Security Compliance**: Handles authentication and role-based authorization.
2. **Kafka Compliance**: Implements request and observer features for Kafka integration.
3. **Persistence API**: Performs ACID transactions between a database and Elasticsearch.
4. **Logging**: Provide an easy logging mechanism into elastic search that can easily be managed in kibana
5. **Request Validation**: Provides a flexible way for validating all incoming request into your nodejs application

## Features

### Security

1. **Authentication**:
   - Supports various JWT authentication method.
   - Provides UUID standard verification methods (e.g., uuidStandardCompliance).
   - Implements  token-based authentication.

2. **Role-based Authorization**:
   - Enforces role-based access control (RBAC) on application resources.
   - Supports dynamic role authorization features and comes with a set of methods(e.g. roleCompliance,adminCompliance...)

### Kafka Compliance

1. **Request Pattern**:
   - Provides a standardized interface for sending requests to Kafka.
   - Handles message serialization, partitioning, and retries.
   - Supports various message request handlers defined by the host application.

2. **Observer Pattern**:
   - Implements a flexible observer method for client app to consume kafka messages .
   - Allows for the registration and management of event handlers.
   - Handles message deserialization and processing.

### Persistence API

1. **ACID Transactions**:
   - Ensures atomicity, consistency, isolation, and durability of data transactions.
   - Supports cross-database (e.g., database and Elasticsearch) transactions.
   - Implements retry mechanisms and error handling for failed transactions.

2. **Elasticsearch Integration**:
   - Allows for the indexing and querying of data in Elasticsearch.
   - Incorporate ElasticSearch client a high-level API for managing Elasticsearch indices and documents.
   - Supports advanced search features and query optimization.
### Logging
   - Logs all database and Elasticsearch operations for audit and debugging purposes.
   - Integrates with a centralized logging system (e.g., Elasticsearch).

### Request Validation
   - Validates incoming requests using a declarative schema-based approach.
   - Supports data transformation and type coercion using class-transformer.
   - Leverages class-validator for comprehensive validation rules.


## Prerequisites

The host application must have the following libraries installed:

- `class-transformer`: Provides a way to transform plain JavaScript/TypeScript objects to instances of classes and back.
- `inversify`: A powerful and lightweight inversion of control (IoC) container for JavaScript and TypeScript.
- `typeorm`: A high-level Object-Relational Mapping (ORM) library that can run in NodeJS, Browser, Cordova, PhoneGap, Electron applications.
- `class-validator`: Allows validation of nested objects and arrays.
- `config`: A flexible configuration management library for managing environment-specific configurations.

## Installation

You can install the library using your preferred package manager:

```
npm i compliance-library
```
## Usage
### Configuration Management
1. **Environment-specific Configurations**:
   - Create a configuration folder(must have name config) in the root directory of your application
   - Add the files custom-environment-variables.json,default.json, development.json, production.json,test.json
   - Allows for easy access to configuration values throughout the application.
   
2. **Configure required environment variables in the custom-environment-variables.json file**:
    - open the file above and add the following code
    
    ```
   {
     "database": {//Database configurations
       "driver": "db_driver",
       "host": "db_host",
       "port": "db_port",
       "username": "db_username",
       "name": "db_name",
       "password": "db_password",
       "connectionUrl": "db_connection_url"
     },
     "jwt": { //jwt configurations for security compliance
       "privateKey": "jwt_private_key",
       "expiresIn": "expiry_time"
     },
     "elasticSearch": { c//onfiguratins for elastic search and logging
       "cloudId": "elastic_cloud_id",
       "username": "elastic_username",
       "password": "elastic_password",
       "logsIndex": "elastic_logs_index",
       "loggingLevel": "elastic_logging_level"
     },
     "kafka": { //configurationgs for kafka
       "brokers": "kafka_brokers",
       "username": "kafka_username",
       "password": "kafka_password",
       "groupId": "kafka_group_id"
     }
   }
   ```
    ```
     Use the export keyword to set export system environment variables above for usage in the system

   #Database configuration environment variables
   export db_driver=mongodb
   export db_host=localhost
   export db_port=27017
   export db_username=
   export db_password=
   export db_name=
   export db_connection_url=
   
   # Kafka configuration environment variables
   export kafka_brokers=
   export kafka_username=
   export kafka_password=
   export kafka_group_id=
   
   # Jwt configuration environment variables
   export jwt_private_key=
   export expiry_time=2h
   
   #Elastic search configuration environment variables
   export elastic_cloud_id=
   export elastic_username=
   export elastic_password=
   export elastic_logs_index=
   export elastic_logging_level=info
   ```
Refer to the typeorm documentation for the supported db_driver.(mysql,postgresql,mongodb)

 Note:
   - Provide the kafka_brokers environment variables as a comma separated list if many
   - To define a different logging level visit the winston-elasticsearch package docs for compliant options
   - You may omit environment variables that do not apply for your specific use
   - Remember to enter the values for the environment variables in the opposite side of the equal to sign.The configurations setting approach above is for typical Linux/Mac environment, refer to the internet on how to set configuration variables for windows environment

### Database and binding initialization
- Define your models following the typeorm standard.(refer to typeorm on https://www.npmjs.com)
```typescript
//Example
    import {Expose} from "class-transformer"
    import {BaseEntity, Column, Entity, ObjectId, ObjectIdColumn, PrimaryColumn} from "typeorm";
    import {UserRoles} from "compliance-library/config/constants/UserRoles";//define your own user roles as enum if need be
    
    
    @Entity("users")
    export class User extends BaseEntity {
    
        @ObjectIdColumn()
        id!: ObjectId;
    
        @Expose()
        @PrimaryColumn({name: "user_id"})
        userId!: string;
    
        @Expose()
        @Column({
            unique: true
        })
        email!: string;
    
        @Column()
        password!: string;
    
        @Expose()
        @Column()
        name!: string;
    
        @Expose()
        @Column({name: "phone_number"})
        phoneNumber!: string;
    
        @Expose()
        @Column({
            type: 'enum',
            enum: UserRoles,
            array: true,
            default: [],
        })
        roles!: UserRoles[];
    }

//This mongodb driver requires id @ObjectIdColumn() id!: ObjectId;. you may exclude this when using other database driver
                                    
```
- Initialize your database

```typescript
//Create a database.ts file an add the following code
//Option 1

    import {User} from "../domain/model/User";
    import DependencyInjectionManager from "compliance-library/config/inversify/DependencyInjectionManager";
    import AppConfigurationProperties from "compliance-library/config/AppConfigurationProperties";
    import DatabaseConfigurationManager from "compliance-library/config/database/DatabaseConfigurationManager";
    import {DI} from "compliance-library/config/inversify/inversify.ioc.types";
    import {Logger} from "compliance-library/config/logging/Logger";
    
    
    async function initializeDatabase() {
    
        const appConfigurations: AppConfigurationProperties = DependencyInjectionManager.getInstance().getContainer().get(DI.AppConfigurationProperties);
    
        DatabaseConfigurationManager
            .setDatabaseConfigurationOnce({
                type: appConfigurations.databaseDriver,
                url: appConfigurations.databaseConnectionUrl,
                synchronize: true,
                logging: false,
                entities: [User],//define all your models here as comma separated list
                migrations: [],
                subscribers: [],
            })
            .getDataSource()
            .initialize()
            .then(() => Logger.info("Database initialization successful"))
            .catch(() => Logger.info("Database initialization failure"));
    }
    
    initializeDatabase()
        .then(() => "done");

//Option 2

    import {User} from "../domain/model/User";
    import DependencyInjectionManager from "compliance-library/config/inversify/DependencyInjectionManager";
    import AppConfigurationProperties from "compliance-library/config/AppConfigurationProperties";
    import DatabaseConfigurationManager from "compliance-library/config/database/DatabaseConfigurationManager";
    import {DI} from "compliance-library/config/inversify/inversify.ioc.types";
    import {Logger} from "compliance-library/config/logging/Logger";
    
    
    async function initializeDatabase() {
    
        const appConfigurations: AppConfigurationProperties = DependencyInjectionManager.getInstance().getContainer().get(DI.AppConfigurationProperties);
    
        DatabaseConfigurationManager
            .setDatabaseConfigurationOnce({
                type: appConfigurations.databaseDriver,
                host: appConfigurations.databaseHost,
                port: appConfigurations.databasePort,
                username: appConfigurations.databaseUsername,
                password: appConfigurations.databasePassword,
                database: appConfigurations.databasName,
                synchronize: true,
                logging: false,
                entities: [User],
                migrations: [],
                subscribers: [],
            })
            .getDataSource()
            .initialize()
            .then(() => Logger.info("Database initialization successful"))
            .catch(() => Logger.info("Database initialization failure"));
    }
    
    initializeDatabase()
        .then(() => "done");

```
- Initialize Inversify container
Create a file called inversify.ioc.config.ts and add the following code inside 
```typescript
    import DependencyInjectionManager from "compliance-library/config/inversify/DependencyInjectionManager";
    
    
    const dependencyInjectionManagerInstance = DependencyInjectionManager.getInstance();
    dependencyInjectionManagerInstance.initializeBindings();
    
    const container = dependencyInjectionManagerInstance.getContainer();

  //You may use the container to define additional bindings for your host application.Refer to inversify documentation to learn how to do it
```
Import the inversify.ioc.config.ts and database.ts files in the app.ts or index.ts (express application entry file) of your application. IT should be at the top after the express import.The inversity.ioc.config.ts file should be imported before the database.ts file.Remember you can rename them with your choice names.
### Security
1. **Authentication**:
  - The application comes with a generateToken functionality that helps generate a token for your application using the jwt environment variables provided. You can use it in your UserService as shown below;
   ```typescript
    import UserResponseDto from "../domain/dto/UserResponseDto";
    import LoginResponseDto from "../domain/dto/LoginResponseDto";
    
    export default interface UserService {
        generateUserToken(user: UserResponseDto): Promise<LoginResponseDto>;
         ...
    }
    
    import UserService from "../../service/UserService";//the interface above
    import {inject, injectable} from "inversify";
    import {classToPlain, plainToClass} from "class-transformer";
    import LoginResponseDto from "../dto/LoginResponseDto";
    import AppConfigurationProperties from "compliance-library/config/AppConfigurationProperties";
    import SecurityCompliance from "compliance-library/security/SecurityCompliance";
    import {DI} from "compliance-library/config/inversify/inversify.ioc.types";
    
    
    @injectable()
    export default class UserServiceImpl implements UserService {
    
        private readonly userRepository: UserRepository;
        private readonly libAppConfigurations: AppConfigurationProperties;
        private readonly apiSecurity: SecurityCompliance;
    
      //use inversify to inject the SecurityCompliance API and the LibraryConfigurations
        constructor(
            @inject(DI.SecurityCompliance) security: SecurityCompliance,
            @inject(DI.AppConfigurationProperties) libAppConfiguration: AppConfigurationProperties) {
            this.apiSecurity = security;
            this.libAppConfigurations = libAppConfiguration;
        }
    
       async generateUserToken(user: UserResponseDto): Promise<LoginResponseDto> {
            const token = await this.apiSecurity.generateToken(classToPlain(user));
            const expiresIn = new Date(new Date().getTime() + (parseInt(this.libAppConfigurations.tokenExpiryTimeInHours.charAt(0)) * 60 * 60 * 1000));
    
            return Promise.resolve(plainToClass(LoginResponseDto, {
                accessToken: token,
                userDetails: user,
                expiresIn: expiresIn
            },{excludeExtraneousValues:true}));
        }
    }
    
  ```
2. **Authorization**:
  -The SecurityCompliance API comes with 3 define authorization mechanisms and one dynamic role verification mechanism
  ```typescript
   //Assuming you've defined the controller below;
    import {NextFunction, Request, Response} from "express";
    import UserRegistrationRequestDto from "../domain/dto/UserRegistrationRequestDto";
    import HttpStatus from "http-status";
    import {inject, injectable} from "inversify";
    import UserService from "../service/UserService";
    import {IOC} from "../config/inversify/inversify.ioc.types";
    import LoginRequestDto from "../domain/dto/LoginRequestDto";
    import {RequestValidator} from "compliance-library/utils/RequestValidator";
    
    declare module 'express' {
        interface Request {
            user?: any
        }
    }
    
    @injectable()
    export default class UserController {
    
        private userService: UserService;
    
        constructor(
            @inject(IOC.UserService) userService: UserService) {
            this.userService = userService;
        }
    
        async getAuthenticatedUser(request: Request, response: Response, next: NextFunction) {
            return response.status(HttpStatus.OK).send(request.user);
        }
    
        async registerUser(request: Request, response: Response, next: NextFunction) {
            const {errors, input} = await RequestValidator(UserRegistrationRequestDto, request.body);
            if (errors) return response.status(HttpStatus.BAD_REQUEST).send(errors);
    
            const user = await this.userService.getUserByEmail(input.email);
            if (user) return response.status(HttpStatus.ALREADY_REPORTED).send("User already exist");
    
            const resource =  await this.userService.registerUser(input);
    
            return response.status(HttpStatus.CREATED).send(resource);
        }
    
        async login(request: Request, response: Response, next: NextFunction) {
            const loggedInUser = await this.userService.getUserByEmail(request.body.email);
            if (!loggedInUser) return response.status(HttpStatus.UNAUTHORIZED).send(HttpStatus[`${HttpStatus.UNAUTHORIZED}_MESSAGE`]);
    
            const {errors, input} = await RequestValidator(LoginRequestDto, request.body);
    
            if (errors) return response.status(HttpStatus.BAD_REQUEST).send(errors);
    
            const isPasswordValid: boolean = await this.userService.verifyPasswordAuthenticity(input.email, input.password);
            if (!isPasswordValid) return response.status(HttpStatus.UNAUTHORIZED).send('invalid user email or password');
    
    
            const loginResponse =  await this.userService.generateUserToken(loggedInUser);
    
            return response.status(HttpStatus.OK).send(loginResponse);
        }
    
    }
     
    //You can secure your application via your router definition as shown below
    import express from "express";
    import UserController from "../controller/UserController";
    import {IOC} from "../config/inversify/inversify.ioc.types";
    import 'express-async-errors';
    import DependencyInjectionManager from "compliance-library/config/inversify/DependencyInjectionManager";
    import SecurityCompliance from "compliance-library/security/SecurityCompliance";
    import {DI} from "compliance-library/config/inversify/inversify.ioc.types";
    
    const router = express.Router();
    
    const dependencyManager = DependencyInjectionManager
        .getInstance().getContainer();
    
    const apiSecurity = dependencyManager.get<SecurityCompliance>(DI.SecurityCompliance);
    const controller = dependencyManager.get<UserController>(IOC.UserController); //use the container in the "Initialize Inversify container" section to define bindings for UserControlller. Refer to inversify documentation
    
    router.post("/register",[apiSecurity.authCompliance.bind(apiSecurity)], controller.registerUser.bind(controller));
    router.put("/:id",[apiSecurity.uuidStandardCompliance.bind(apiSecurity),apiSecurity.authCompliance.bind(apiSecurity),apiSecurity.adminCompliance.bind(apiSecurity)], controller.updateUser.bind(controller));
    router.get("/me",apiSecurity.adminCompliance.bind(apiSecurity),apiSecurity.driverCompliance.bind(apiSecurity), controller.getAuthenticatedUser.bind(controller));
    router.post("/login",apiSecurity.roleCompliance.bind(apiSecurity,["ADMIN","DRIVER","SUPERADMIN"]) controller.login.bind(controller));
    
    export default router;

//The roleCompliance feature provide dynamic role checks to the auth user roles in the request object.Check the authCompliance implementation for more details
```

### Kafka Compliance
 - The KafkaCompliance API provides two major methods and is built on top of kafkajs to facilitate kafka operations in the typical web application

1. KafkaObserver: This typical watches a particular topic and group to listen to incoming messages and performs operations accordingly
   
    ```typescript
    // Define your topics in an enum type as shown below;
    import {Application} from "express"; export enum KafkaTopics {
       USER_MANAGEMENT_TOPIC = "USER_MANAGEMENT_TOPIC",
       USER_TOPIC="USER_TOPIC"
    }
    // Create a KafkaServiceImpl class in your host application and extends the KafkaService interface from the compliance-library and provide implementations for its methods as shonw below;
    import KafkaService from "compliance-library/kafka/abstraction/KafkaService";
    import {inject, injectable} from "inversify";
    import KafkaPayload from "compliance-library/kafka/dto/KafkaPayload";
    import {KafkaTopics} from "../../config/constants/kafka.topics";
    import UserRepository from "../../repository/UserRepository";
    import {User} from "../model/User";
    import {IOC} from "../../config/inversify/inversify.ioc.types";
    import KafkaResponse from "compliance-library/kafka/dto/KafkaResponse";
    
    
    @injectable()
    export default class KafkaServiceImpl implements KafkaService {
    
        private userRepository: UserRepository;
    
        constructor(
            @inject(IOC.UserRepository) userRepository: UserRepository) {
            this.userRepository = userRepository;
        }
    
        request(payload: KafkaPayload): Promise<KafkaResponse> {
             //deinfe the request operation depending on the incoming request as shown the next method
            return Promise.resolve({payload: "", correlationId: payload.correlationId});
        }
    
        async response(payload: KafkaPayload): Promise<void> {
            switch(payload.incoming){
               case KafkaTopics.USER_MANAGEMENT_TOPIC:
                    const data:any = payload.payload;
                    const user: User | null = await this.userRepository.findOne(data.userId);
                    if (user) {
                        user.roles = data.roles;
                        await this.userRepository.update(user.userId, user);
                       }
                     break;
   
                    ...
                   
               case "XTOPIC":
                  // perform operation accordingly depending on the topic which defines which microservice it comes from
                 break;
                 
        }
    
    }
   ````
   Remember to add bindings for the class above using inversify approach so that u can call it in the app.ts and pass it as an argument to kafkaObserver
   At the index.ts or app.ts file of your application, call the KafkaObserver method as shown below
   ```typescript
      import express,{Application} from "express";
      import "reflect-metadata";
      import "./config/inversify/inversify.ioc.config";
      import "./startup/database";
      import {startApplication} from "./startup/boot";
      import {KafkaTopics} from "./config/constants/kafka.topics";
      import AppConfigProperties from "./config/AppConfigProperties";
      import {IOC} from "./config/inversify/inversify.ioc.types";
      import DependencyInjectionManager from "compliance-library/config/inversify/DependencyInjectionManager";
      import {Logger} from "compliance-library/config/logging/Logger";
      import KafkaCompliance from "compliance-library/kafka/abstraction/KafkaCompliance";
      import {DI} from "compliance-library/config/inversify/inversify.ioc.types";
      import KafkaService from "compliance-library/kafka/abstraction/KafkaService";
      
      
      const app: Application = express();
      const dependencyManager = DependencyInjectionManager.getInstance().getContainer();
      const kafkaCompliance: KafkaCompliance = dependencyManager.get<KafkaCompliance>(DI.KafkaCompliance); //remember, you can also inject this via the constructor of your class
      const kafkaService: KafkaService = dependencyManager.get<KafkaService>(IOC.KafkaService);
      const appConfig: AppConfigProperties = dependencyManager.get(IOC.AppConfigProperties); //define the host application configurations following inversify concept but using the container from the compliance library
      
      const startServer = function () {
      
          startApplication(app, appConfig);
      
          kafkaCompliance.kafkaObserver(KafkaTopics.USER_TOPIC, kafkaService)
              .then(() => Logger.info("consume success"))
              .catch((err) => Logger.error(err));
      
          process.on("uncaughtException",
              (exp) => Logger.error(exp.message, exp));
      
          const port: number = Number(process.env.PORT) || parseInt(appConfig.appPort);
      
          return app.listen(port, () => Logger.info(`The application ${appConfig.appName} started on port ${port}`));
      };
      
      export const server = startServer();
        

2. KafkaRequest: This method can be used to request a specific item from another service and make a service call to save data without expecting a response using specific topics name
 ```typescript
    //Create a controller or any class of use in your application and use the kafkaRequest as follow;
    import {NextFunction, Request, Response} from "express";
    import HttpStatus from "http-status";
    import {inject, injectable} from "inversify";
    import {IOC} from "../config/inversify/inversify.ioc.types";
    import {RequestValidator} from "compliance-library/utils/RequestValidator";
    import {KafkaTopics} from "../config/constants/kafkaTopics";
    import {plainToClass} from "class-transformer";
    import KafkaPayload from "compliance-library/kafka/dto/KafkaPayload";
    import {DI} from "compliance-library/config/inversify/inversify.ioc.types";
    import KafkaCompliance from "compliance-library/kafka/abstraction/KafkaCompliance"; import UserResponseDto from "./UserResponseDto"; import UserService from "./UserService";
    
    
    @injectable()
    export default class RoleManagementController {
    
        private userService: UserService;
        private kafkaCompliance: KafkaCompliance;
    
        constructor(
            @inject(IOC.UserService) userService: UserService,//Define local bindings for this implementation using the container from the library
            @inject(DI.KafkaCompliance) kafkaCompliance: KafkaCompliance) {
            this.userService = userService;
            this.kafkaCompliance = kafkaCompliance;
        }
    
        async registerUserRoles(request: Request, response: Response, next: NextFunction) {
            const {errors, input} = await RequestValidator(UserRoleRegistrationDto, request.body);
    
            if (errors) return response.status(HttpStatus.BAD_REQUEST).send(errors);
    
            const userRoles: UserRoleResponseDto = await this.userService.registerUserRole(input);
    
            await this.kafkaCompliance.kafkaRequest(KafkaTopics.USER_TOPIC, plainToClass(KafkaPayload, {
                payload: {
                    userId: user.userId,
                    roles: ['ADMIN']
                },
                correlationId: null,
                replyTo: null,
                incoming: KafkaTopics.USER_MANAGEMENT_TOPIC
            }));
            return response.status(HttpStatus.CREATED).send(userRoles);
        }
        
    }
```
**NOTE**:
  - If the correlationId is null then you are telling the KafkaObserver to call the request method of the KafkaServiceImpl in the server application to save the specific data you want to save
  - if the correlationId is set to any unique UUID, that means it's a data request and expects result from the server application. The kafkaObserver method will call the request method of the KafkaServiceImpl to perform certain operations and sent the data back to the client application
  - if the correlationId is not null you must provide the replyTo topic which is a temporal unique topic. This is the topic the KafkaObserver will reply to with data from the server application


### Persistence API
The persistence API provider crud operations under the hood for database base and elastic search operations
- Create a model User.ts using the typeorm definition as shown below
```typescript
    import {Expose} from "class-transformer"
    import {BaseEntity, Column, Entity, ObjectId, ObjectIdColumn, PrimaryColumn} from "typeorm";
    import {UserRoles} from "compliance-library/config/constants/UserRoles";
    
    
    @Entity("users")
    export class User extends BaseEntity {
    
        @ObjectIdColumn()
        id!: ObjectId;
    
        @Expose()
        @PrimaryColumn({name: "user_id"})
        userId!: string;
    
        @Expose()
        @Column({
            unique: true
        })
        email!: string;
    
        @Column()
        password!: string;
    
        @Expose()
        @Column()
        name!: string;
    
        @Expose()
        @Column({name: "phone_number"})
        phoneNumber!: string;
    
        @Expose()
        @Column({
            type: 'enum',
            enum: UserRoles,
            array: true,
            default: [],
        })
        roles!: UserRoles[];
    }
```
- Define a Repository Interface UserRepistory.ts
```typescript
    import {User} from "../domain/model/User";
    
    export default interface UserRepository {
    
        create(user: User): Promise<User>;
    
        findOne(id: string): Promise<User | null>;
    
        find(): Promise<User[]>;
    
        delete(user:User): Promise<void>;
    
        update(id:string,user: User): Promise<User>;
    
    }
```
- Define an elastic key definition file called PersistenceKey.ts
 ```typescript
      export enum PersistenceKey {
          EMAIL="email"
      }
  //Remember it is advisable to use email as the elastic key when you are dealing with the user model but you should use the primary key of any model when implementing their repository.The findOne and find methods retrieve data from elastic search not the DB
```
- Create your UserRepositoryImpl.ts file and use the persistenceFacade for CRUD operations as shown below
```typescript

    import UserRepository from "../UserRepository";
    import {User} from "../../domain/model/User";
    import {inject, injectable} from "inversify";
    import {PersistenceKey} from "../../config/constants/PersistenceKey";
    import {v4 as uuidv4} from 'uuid';
    import PersistenceFactory from "compliance-library/persistence/abstraction/PersistenceFactory";
    import {DI} from "compliance-library/config/inversify/inversify.ioc.types";
    import {PersistingPayloadBuilder} from "compliance-library/persistence/builder/PersistingPayloadBuilder";
    import {PersistingPayload} from "compliance-library/persistence/dto/PersistingPayload";
    import {PersistenceOperation} from "compliance-library/persistence/PersistenceOperation";
    import {ElasticIndex} from "compliance-library/config/constants/ElasticIndex";
    import {RetrievingPayload} from "compliance-library/persistence/dto/RetrievingPayload";
    import {RetrievingPayloadBuilder} from "compliance-library/persistence/builder/RetrievingPayloadBuilder";
    
    
    @injectable()
    export default class UserRepositoryImpl implements UserRepository {
    
        private readonly persistenceFactory: PersistenceFactory;
    
        constructor(
            @inject(DI.PersistenceFactory) persistenceApi: PersistenceFactory) {
            this.persistenceFactory = persistenceApi;
        }
    
        async create(user: User): Promise<User> {
            user.userId = uuidv4();
    
            const payload: PersistingPayload = PersistingPayloadBuilder.builder()
                .model(User)
                .payload(user)
                .elasticIndex(ElasticIndex.USER)
                .method(PersistenceOperation.CREATE)
                .primaryKey(PersistenceKey.EMAIL) //use PersistenceKey.package_id for PackageRepository instead
                .build();
    
            const {resource} = await this.persistenceFactory.persist(payload);
    
            return Promise.resolve(resource);
        }
    
        async delete(user: User): Promise<void> {
            const payload: PersistingPayload = PersistingPayloadBuilder.builder()
                .model(User)
                .payload(user)
                .elasticIndex(ElasticIndex.USER)
                .method(PersistenceOperation.DELETE)
                .primaryKey(PersistenceKey.EMAIL)
                .build();
    
            const {resource} = await this.persistenceFactory.persist(payload);
    
    
            return Promise.resolve();
        }
    
        async findOne(id: string): Promise<User | null> {
            try {
                const payload: RetrievingPayload = RetrievingPayloadBuilder.builder()
                    .model(User).elasticIndex(ElasticIndex.USER)
                    .keyValue(id).build();
                const {resource} = await this.persistenceFactory.retrieve(payload);
    
                return Promise.resolve(resource[0]);
            } catch (e) {
                return Promise.resolve(null);
            }
        }
    
        async find(): Promise<User[]> {
            try {
                const payload: RetrievingPayload = RetrievingPayloadBuilder.builder()
                    .model(User).elasticIndex(ElasticIndex.USER)
                    .build();
                const {resource} = await this.persistenceFactory.retrieve(payload);
    
                return Promise.resolve(resource);
            } catch (e) {
                return Promise.resolve([]);
            }
        }
    
        async update(id: string, user: User): Promise<User> {
    
            const payload: PersistingPayload = PersistingPayloadBuilder.builder()
                .model(User)
                .payload(user)
                .elasticIndex(ElasticIndex.USER)
                .method(PersistenceOperation.UPDATE)
                .primaryKey(PersistenceKey.EMAIL)
                .build();
    
            const {resource} = await this.persistenceFactory.persist(payload);
    
            return Promise.resolve(resource);
        }
    
    }

```

### Request Validation
Effective request validation requires the use of the class-transform and class-validator libraries 
    
1. Create a UserRegistrationDto.ts and define your validations as shown below

    ```typescript
        import {IsEmail, IsPhoneNumber, IsString, IsStrongPassword} from "class-validator";
        
        export default class UserRegistrationRequestDto {
            @IsEmail()
            email!: string;
        
            @IsStrongPassword()
            password!: string;
        
            @IsString()
            name!: string;
        
            @IsPhoneNumber("CM")
            phoneNumber!: string;
        }
       //refer to class-validator library for more details
    ```
2. Implement validation in your controller as shown below
   ```typescript
        import {NextFunction, Request, Response} from "express";
        import UserRegistrationRequestDto from "../domain/dto/UserRegistrationRequestDto";
        import HttpStatus from "http-status";  
        import {RequestValidator} from "compliance-library/utils/RequestValidator";
        
        
        export default class UserController {
            async registerUser(request: Request, response: Response, next: NextFunction) {
                const {errors, input} = await RequestValidator(UserRegistrationRequestDto, request.body);
                if (errors) return response.status(HttpStatus.BAD_REQUEST).send(errors);
        
                ...
            }
        }
   ```
### Logging
 The Logging feature of the library is build ontop of winston-elasticsearch library and sends your logs(to a specific index provided in the environment variables above) to elastic search and can be analyzed by kibana
 ```typescript
   //example implementation
    import express, {Application} from "express";
    import "reflect-metadata";
    import "./config/inversify/inversify.ioc.config";
    import "./startup/database";
    import {Logger} from 'compliance-library/config/logging/Logger';//import Logger from compliance library

    const startServer = function () {
        
        process.on("uncaughtException",
            (exp) => Logger.error(exp.message, exp)); //use the Logger function to log data to elastic search and analyze through kibana

    };
    
    export const server = startServer();
```
### Error Handling Middleware
```typescript
  //Example
  
  import express, {Application} from "express";
  import cors from "cors";
  import compression from "compression";
  //import helmet from "helmet";
  import userApis from "../routes/user.routes";
  import {handleException} from "compliance-library/exceptions/ExceptionHandler";//error handler middleware
  import AppConfigProperties from "../config/AppConfigProperties";
  
  
  export const startApplication = function (app: Application, appConfig: AppConfigProperties) {
      app.use(express.json());
     // app.use(helmet());
      app.use(cors({
          origin: appConfig.allowedOrigin,
          methods: ['GET', 'POST', 'PUT', 'DELETE'],
          allowedHeaders: ['Content-Type', 'Authorization', 'Host', 'X-REAL-IP', 'Connection', 'Upgrade']
      }));
      app.use(compression());
      app.use("/api/users", userApis);
      app.use(handleException);

  };
```
Remember to import the 'express-async-errors' library in your routes. For more information on this library visit the npmjs registry
```typescript
 //Example
    import express ,{NextFunction,Request,Response}from "express";
    import 'express-async-errors';
 
    const router = express.Router();
    
    router.post("/register", async (request:Request,response: Response,next: NextFunction) =>{
    
});
    export default router;
```

For more detailed information and examples, please refer to the library's documentation.

## Keywords
Javascript,typescript, npm, express, node, kafka,elastic search

### Use Cases
error handling,logging,persistence,distributed data streaming

## Author
[Ewang Clarkson](https://github.com/ewangclarkson) - ewangclarks@gmail.com


## Contributing

We welcome contributions to the library. If you have any ideas, bug fixes, or feature requests, please create an issue or submit a pull request.

## License

This library is licensed under the [MIT License](LICENSE).