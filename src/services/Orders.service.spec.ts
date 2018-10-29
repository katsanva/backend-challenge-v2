import { expect } from 'chai';
import Orders from './Orders.service';
import { IPhoneDTO } from '../models/Phone.model';

describe('Orders.service', () => {
  describe('sumPrices', () => {
    const { sumPrices } = Orders.methods;

    it('should return the right total', () => {
      const phones: IPhoneDTO[] = [
        {
          price: '42.02',
        },
        { price: '33.59' },
      ];
      const expected = '75.61';
      const result = sumPrices(phones);

      expect(result).to.eql(expected);
    });
    it('should return the right price for no data', () => {
      const phones: IPhoneDTO[] = [];
      const expected = '0.00';
      const result = Orders.methods.sumPrices(phones);

      expect(result).to.eql(expected);
    });
  });

  describe('invalidPhonesPassed', () => {
    const { invalidPhonesPassed } = Orders.methods;

    it('should throw error', () => {
      const phones = [
        {
          _id: '_id',
        },
      ];
      const input = ['_id', '_id2'];
      expect(() => invalidPhonesPassed(input, phones)).to.throw();
    });

    it('error should contain missing ids', () => {
      const phones = [
        {
          _id: '_id',
        },
      ];
      const input = ['_id', '_id2'];
      try {
        invalidPhonesPassed(input, phones);
      } catch (e) {
        expect(e.data).to.eql([
          {
            type: 'not_exist',
            message: 'Provided phones do not exist',
            values: ['_id2'],
          },
        ]);

        return;
      }

      expect(true).to.eql(false);
    });
  });
});
