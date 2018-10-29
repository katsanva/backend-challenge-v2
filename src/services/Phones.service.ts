import DbService from 'moleculer-db';
import MongooseAdapter from 'moleculer-db-adapter-mongoose';
import * as Moleculer from 'moleculer';
import { TransformMixin } from '../mixins/Transform.mixin';
import PhoneModel from '../models/Phone.model';
import config from 'config';
import Validator from 'fastest-validator';
import BigNumber from 'bignumber.js';

const validator = new Validator();
const schema = {
  image: 'url',
  name: 'string',
  description: 'string',
  price: {
    type: 'string',
    pattern: /^\d*\.\d{2}$/,
  },
};
const check = validator.compile(schema);

const adapter = new MongooseAdapter(
  config.get('mongodb.url'),
  config.get('mongodb.options'),
);

export = {
  name: 'phones',
  mixins: [DbService, TransformMixin],
  model: PhoneModel,
  adapter,
  settings: {
    populates: {},
    async entityValidator(entity: any) {
      const validationResult = check(entity);

      if (validationResult !== true) {
        throw new Moleculer.Errors.ValidationError(
          'Validation failed',
          'params',
          validationResult,
        );
      }

      return validationResult;
    },
  },
  afterConnected() {
    this.logger.info('Connected successfully');
  },
} as Moleculer.ServiceSchema;
