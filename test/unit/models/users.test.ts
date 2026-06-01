jest.mock('../../../src/helper/database', () => ({
  run_query: jest.fn()
}));

import { findByUsername } from '../../../src/model/users';
import * as db from '../../../src/helper/database';

describe('users model', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('findByUsername returns user array when db returns rows', async () => {
    (db.run_query as jest.Mock).mockResolvedValue([{ id: 1, username: 'alice', password: 'secret', role: 'User' }]);
    const res = await findByUsername('alice');
    expect(db.run_query).toHaveBeenCalled();
    expect(res).toEqual([{ id: 1, username: 'alice', password: 'secret', role: 'User' }]);
  });

  it('findByUsername returns empty array when no user', async () => {
    (db.run_query as jest.Mock).mockResolvedValue([]);
    const res = await findByUsername('nobody');
    expect(res).toEqual([]);
  });
});
