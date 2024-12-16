import "reflect-metadata"
import { config } from "../config/configuration";
import { DataSource, DataSourceOptions } from "typeorm";

const AppDataSource = new DataSource({
    type: config.DB_TYPE,
    host: config.DB_HOST,
    port: config.DB_PORT,
    username: config.DB_USERNAME,
    password: config.DB_PASSWORD,
    database: config.DB_DATABASE,
    schema: 'public',
    dropSchema: false,
    synchronize: false,
    logging: config.NODE_ENV !== 'production',
    entities: [__dirname + '/entities/**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
    cli: {
        entitiesDir: 'src',
        migrationsDir: 'src/database/migrations',
        subscribersDir: 'subscriber',
    },
    extra: {
        max: parseInt(config.DB_MAX_CONNECTIONS ?? '100', 10),
        ssl:
            config.DB_SSL_ENABLED === 'true'
                ? {
                    rejectUnauthorized: config.DB_REJECT_UNAUTHORIZED === 'true',
                }
                : undefined,
    },
} as DataSourceOptions)

export default AppDataSource;