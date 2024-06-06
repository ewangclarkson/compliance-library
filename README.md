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
https://www.npmjs.com/package/compliance-library
