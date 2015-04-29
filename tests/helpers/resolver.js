import Resolver from 'ember/resolver';
import config from '../../config/environment';

const resolver = Resolver.create();
const {
  modulePrefix,
  podModulePrefix
} = config;

resolver.namespace = {
  modulePrefix,
  podModulePrefix
};

export default resolver;
