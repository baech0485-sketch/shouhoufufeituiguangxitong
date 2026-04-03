export function applyLoadedEnvToProcess(loadedEnv, target = process.env) {
  Object.entries(loadedEnv).forEach(([key, value]) => {
    target[key] = value;
  });

  return target;
}
