import APIService from 'moleculer-web';
import config from 'config';
import helmet from 'helmet';
import bodyParser from 'body-parser';

const DEFAULT_MAPPING_POLICY = 'restrict';

export = {
  name: 'gateway',
  mixins: [APIService],
  dependencies: ['phones', 'orders'],
  settings: {
    use: [
      helmet({
        noCache: true,
        contentSecurityPolicy: {
          directives: {
            defaultSrc: [`'self'`],
          },
        },
      }),
      bodyParser.json(),
    ],
    port: config.get('app.server.port'),
    ip: config.get('app.server.address'),
    routes: [
      {
        path: '/api',
        mappingPolicy: DEFAULT_MAPPING_POLICY,
        whitelist: ['phones.create', 'phones.list', 'orders.createNew'],
        aliases: {
          'POST phones': 'phones.create',
          'GET phones': 'phones.list',
          'POST /orders': 'orders.createNew',
        },
      },
    ],
  },
};
