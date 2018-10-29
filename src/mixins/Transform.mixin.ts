import { Context } from 'moleculer';
import { omit, map } from 'ramda';

export const onlyData = (ctx: Context, res: any) =>
  ctx.params.full ? res : omit(['createdAt', 'updatedAt', '__v'], res);

export const onlyDataCollection = (ctx: Context, res: any) => {
  if (!res || !res.rows || !res.rows.length) {
    return res;
  }

  return {
    ...res,
    rows: map((row: any) => onlyData(ctx, row), res.rows),
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
