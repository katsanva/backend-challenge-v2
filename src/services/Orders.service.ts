import DbService from 'moleculer-db';
import MongooseAdapter from 'moleculer-db-adapter-mongoose';
import * as Moleculer from 'moleculer';
import { TransformMixin } from '../mixins/Transform.mixin';
import config from 'config';
import { BigNumber } from 'bignumber.js';
import { pick, reduce, difference } from 'ramda';

import OrderModel, { IOrderDTO } from '../models/Order.model';
import { IPhoneDTO } from '../models/Phone.model';

const adapter = new MongooseAdapter(
  config.get('mongodb.url'),
  config.get('mongodb.options'),
);

export = {
  name: 'orders',
  mixins: [DbService, TransformMixin],
  model: OrderModel,
  adapter,
  settings: {
    populates: {},
  },
  actions: {
    createNew: {
      name: 'createNew',
      params: {
        customer: {
          type: 'object',
          props: {
            name: 'string',
            surname: 'string',
            email: 'email',
          },
        },
        phones: {
          type: 'array',
          min: 1,
          items: {
            type: 'string',
            pattern: /^[a-f\d]{24}$/i,
          },
        },
      },
      async handler(ctx: Moleculer.Context) {
        const {
          params: { phones: input },
        } = ctx;
        const phones: IPhoneDTO[] = await ctx.call('phones.find', {
          query: { _id: { $in: input } },
          limit: input.length,
          fields: ['price'],
        });

        // assume that there is no duplicates in input
        if (phones.length !== input.length) {
          throw new Moleculer.Errors.ValidationError(
            'Some of phones are incorrect',
            'field',
            [
              {
                type: 'not_exist',
                message: 'Provided phones do not exist',
                values: difference(
                  input,
                  reduce((acc: string[], { _id }) => [...acc, _id], [], phones),
                ),
              },
            ],
          );
        }

        const total = reduce(
          (acc: BigNumber, { price }: IPhoneDTO) =>
            acc.plus(new BigNumber(price)),
          new BigNumber(0),
          phones,
        ).toFixed(2);

        const dataToInsert: IOrderDTO = {
          ...pick(['customer', 'phones'], ctx.params),
          total,
        } as IOrderDTO;

        this.logger.info(dataToInsert);

        return ctx.call('orders.create', dataToInsert);
      },
    },
  },
  afterConnected() {
    this.logger.info('Connected successfully');
  },
} as Moleculer.ServiceSchema;
