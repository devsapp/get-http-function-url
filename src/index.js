const core = require("@serverless-devs/core");
const _ = core.lodash;
const logger = new core.Logger('get-http-function-url');

async function index(inputs, { region, functionName, serviceName, envKey = 'WEBHOOKURL' } = {}) {
  if (!(region || functionName || serviceName)) {
    logger.debug(`region: ${region} functionName: ${functionName} serviceName: ${serviceName}, skip.`);
    return inputs;
  }

  const fcInfo = await core.loadComponent('devsapp/fc-info');
  const remote = (await getRemoteConfig(fcInfo, _.cloneDeep(inputs), {
    region,
    serviceName,
    functionName,
  }));

  core.Logger.debug('get http url', JSON.stringify(remote));

  const latestHttpConfig = _.find(
    _.get(remote, 'triggers', []),
    (o) => {
      const qualifier = _.get(o, 'config.qualifier', '');
      return _.isNil(qualifier) || _.toUpper(qualifier) === 'LATEST';
    }
  );

  const urlInternet = _.get(latestHttpConfig, 'urlInternet');
  if (!urlInternet) {
    throw new Error(`${envKey} is not obtained, please manually configure: backend.props.function.environmentVariables.${envKey}`);
  }

  _.set(inputs, `props.function.environmentVariables.${envKey}`, urlInternet);
  return inputs;
};


async function getRemoteConfig(fcInfo, cloneInputs, props) {
  cloneInputs.props = props;
  try {
    return await fcInfo.info(cloneInputs);
  } catch (ex) {
    if (ex && ex.code && ex.code.endsWith('NotFound')) {
      return {};
    }
    throw ex;
  }
}

module.exports = index;
