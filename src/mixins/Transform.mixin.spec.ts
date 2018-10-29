import { onlyData, onlyDataCollection } from './Transform.mixin';
import { expect } from 'chai';

describe('Transform.mixin', () => {
  describe('onlyData', () => {
    it('should remove unnecessary fields', () => {
      const ctx: any = { params: {} };
      const res = {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
        __v: '__v',
        some: 'data',
      };
      const expected = {
        some: 'data',
      };

      const result = onlyData(ctx, res);

      expect(result).to.eql(expected);
    });

    it('should pass full response', () => {
      const ctx: any = { params: { full: true } };
      const res = {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
        __v: '__v',
        some: 'data',
      };

      const result = onlyData(ctx, res);

      expect(result).to.eql(res);
    });
  });

  describe('onlyDataCollection', () => {
    it('should remove unnecessary fields', () => {
      const ctx: any = { params: {} };
      const res = {
        rows: [
          {
            createdAt: 'createdAt',
            updatedAt: 'updatedAt',
            __v: '__v',
            some: 'data',
          },
        ],
        some: 'fields',
      };
      const expected = {
        rows: [
          {
            some: 'data',
          },
        ],
        some: 'fields',
      };

      const result = onlyDataCollection(ctx, res);

      expect(result).to.eql(expected);
    });

    it('should pass full response', () => {
      const ctx: any = { params: { full: true } };
      const res = {
        rows: [
          {
            createdAt: 'createdAt',
            updatedAt: 'updatedAt',
            __v: '__v',
            some: 'data',
          },
        ],
        some: 'fields',
      };

      const result = onlyDataCollection(ctx, res);

      expect(result).to.eql(res);
    });
  });
});
