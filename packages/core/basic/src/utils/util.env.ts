export function isDev() {
  const nodeEnv = process.env.NODE_ENV || '';
  return nodeEnv === 'development' || nodeEnv.indexOf('local') >= 0;
}
