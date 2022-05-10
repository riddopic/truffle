module.exports = async function (options) {
  const Console = require("../../console");
  const loadConfig = require("../debug/loadConfig");
  const { Environment } = require("@truffle/environment");

  if (options.url && options.network) {
    throw new Error(
      "'url' and 'network' options should not be specified together"
    );
  }

  let config = loadConfig(options);

  const commands = require("../index");
  const excluded = new Set(["console", "init", "watch", "develop"]);

  const consoleCommands = Object.keys(commands).reduce((acc, name) => {
    return !excluded.has(name)
      ? Object.assign(acc, { [name]: commands[name] })
      : acc;
  }, {});

  await Environment.detect(config);
  const c = new Console(consoleCommands, config.with({ noAliases: true }));
  return await c.start();
};
