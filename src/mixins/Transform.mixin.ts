import { Context } from 'moleculer';
import { omit, map } from 'ramda';

const simpleOmit = omit(['createdAt', 'updatedAt', '__v']);

export const onlyData = (ctx: Context, res: any) =>
  ctx.params.full ? res : simpleOmit(res);

export const onlyDataCollection = (ctx: Context, res: any) => {
  if (ctx.params.full || !res || !res.rows || !res.rows.length) {
    return res;
  }

  return {
    ...res,
    rows: map(simpleOmit, res.rows),
  };
};

export const TransformMixin = {
  hooks: {
    after: {
      create: onlyData,
      update: onlyData,
      find: onlyDataCollection,
      list: onlyDataCollection,
    },
  },
};
