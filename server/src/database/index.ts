import { join } from 'path'
import { DataSource, type DataSourceOptions } from 'typeorm'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'
import { newDb } from 'pg-mem'
import * as entities from '../entities'

export function createDatabase(
  options: Partial<DataSourceOptions | { type: 'pg-mem' }> = {}
) {
  if (options.type === 'pg-mem') {
    return createMemoryDatabase()
  }

  return new DataSource({
    entities,
    migrations: [relative('./migrations/**/*.ts')],
    namingStrategy: new SnakeNamingStrategy(),
    ...options,
  } as any)
}

function createMemoryDatabase(): DataSource {
  const pgMemory = newDb()

  pgMemory.public.registerFunction({
    name: 'current_database',
    implementation: () => 'test',
  })
  pgMemory.public.registerFunction({
    name: 'version',
    implementation: () => '1',
  })

  return pgMemory.adapters.createTypeormDataSource({
      type: 'postgres',
      entities,
      synchronize: true,
      logging: false,
      namingStrategy: new SnakeNamingStrategy(),
  });
}

export function relative(...paths: string[]) {
  return join(__dirname, ...paths)
}

export type Database = DataSource
