import child_process, { ChildProcess } from 'child_process';
import { promisify } from 'util';
import fetch from 'node-fetch';
import { expect } from 'chai';

const spawn = promisify(child_process.spawn);

describe('API', () => {
  const host = 'http://localhost:3000';
  let spawned: ChildProcess;
  before((done: any) => {
    spawned = child_process.spawn('npm', ['run', 'dev:runner'], {});

    spawned.stdout.on('data', (data: Buffer) => {
      if (data.toString().match('API Gateway listening on')) {
        done();
      }
    });
  });

  after('close', () => {
    const awaiter = new Promise((r: any) => spawned.on('close', r));

    spawned.kill();

    return awaiter;
  });

  describe('phones', () => {
    const path = 'api/phones';

    describe('Create a phone record', () => {
      it('should be ok', async () => {
        const body = {
          image: 'http://some.good/link',
          name: 'name',
          description: 'description',
          price: '42.00',
        };
        const res = await fetch(`${host}/${path}`, {
          method: 'POST',
          body: JSON.stringify(body),
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        });

        expect(res.status).to.eql(200);
      });

      it('should not pass validation (price invalid)', async () => {
        const body = {
          image: 'http://some.good/link',
          name: 'name',
          description: 'description',
          price: 'fff',
        };
        const res = await fetch(`${host}/${path}`, {
          method: 'POST',
          body: JSON.stringify(body),
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        });

        expect(res.status).to.eql(422);
      });

      it('should not pass validation (missing field)', async () => {
        const body = {
          name: 'name',
          description: 'description',
          price: '42.00',
        };
        const res = await fetch(`${host}/${path}`, {
          method: 'POST',
          body: JSON.stringify(body),
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        });

        expect(res.status).to.eql(422);
      });

      it('should not pass validation (invalid field)', async () => {
        const body = {
          image: 'image',
          name: 'name',
          description: 'description',
          price: '42.00',
        };
        const res = await fetch(`${host}/${path}`, {
          method: 'POST',
          body: JSON.stringify(body),
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        });

        expect(res.status).to.eql(422);
      });
    });

    describe('Obtaining list of phones', () => {
      it('should be ok', async () => {
        const res = await fetch(`${host}/${path}`);

        expect(res.status).to.eql(200);
      });

      it('should return a list of phones', async () => {
        const json = await fetch(`${host}/${path}`).then((r: any) => r.json());

        expect(json.rows).to.be.a('array');
      });
    });
  });

  describe('orders', () => {
    const path = 'api/orders';

    describe('Create a order record', () => {
      let existingId: string;
      before(async () => {
        const body = {
          image: 'http://some.good/link',
          name: 'name',
          description: 'description',
          price: '42.00',
        };
        const data = await fetch(`${host}/api/phones`, {
          method: 'POST',
          body: JSON.stringify(body),
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }).then(r => r.json());

        existingId = data._id;
      });

      it('should be ok', async () => {
        const body = {
          customer: {
            name: 'Name',
            surname: 'Surname',
            email: 'foo@bla.com',
          },
          phones: [existingId],
        };
        const res = await fetch(`${host}/${path}`, {
          method: 'POST',
          body: JSON.stringify(body),
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        });

        expect(res.status).to.eql(200);
      });

      it('should fail with parameters validation', async () => {
        const body: any = {
          customer: {
            name: 'Name',
            surname: 'Surname',
            email: 'foo@bla.com',
          },
          phones: [],
        };
        const res = await fetch(`${host}/${path}`, {
          method: 'POST',
          body: JSON.stringify(body),
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        });
        const json = await res.json();

        expect(res.status).to.eql(422);
        expect(json.message).to.be.eql('Parameters validation error!');
      });

      it('should fail with phones checking', async () => {
        const body: any = {
          customer: {
            name: 'Name',
            surname: 'Surname',
            email: 'foo@bla.com',
          },
          phones: [existingId, '507f191e810c19729de860ea'],
        };
        const res = await fetch(`${host}/${path}`, {
          method: 'POST',
          body: JSON.stringify(body),
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        });
        const json = await res.json();

        expect(res.status).to.eql(422);
        expect(json.message).to.be.eql('Some of phones are incorrect');
      });
    });
  });
});
