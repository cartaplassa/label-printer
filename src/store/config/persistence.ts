import { type Config, createDefaultConfig } from '@/domain/config';
import { createMigratedStorage } from '@/lib/migratedStorage';
import { decodeV2, migrateToV1, migrateToV2 } from './migrations';

const configStorage = createMigratedStorage<Config>({
    key: 'labelPrinterStore',
    version: 2,
    defaultValue: createDefaultConfig,
    decode: decodeV2,
    migrations: {
        1: migrateToV1,
        2: migrateToV2,
    },
});

export const loadConfig = configStorage.load;
export const saveConfig = configStorage.save;
