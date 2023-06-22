type ConfigType<T> = Partial<{
  development: T
  production: T
  test: T
}>

export function handleEnvironments<T>(
  obj: Partial<{ [env in typeof process.env.NODE_ENV]: T }>,
  defaultKey: typeof process.env.NODE_ENV = "production"
): T {
  const env = process.env.NODE_ENV || defaultKey
  return obj[env] as T
}
