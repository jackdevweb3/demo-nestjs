import { LOG_METADATA, LOG_METADATA_CONFIG } from '../logger.constant';

/**
 *
 *
 * @description Using decoration @Log4j to log
 * @param metadata
 * @returns
 */
export function Log4j(metadata?: string): PropertyDecorator {
  return (target: object, propertyKey: string | symbol): void => {
    Reflect.set(target, propertyKey, null);
    Reflect.defineMetadata(LOG_METADATA, true, target, propertyKey);
    Reflect.defineMetadata(LOG_METADATA_CONFIG, metadata, target, propertyKey);
  };
}
