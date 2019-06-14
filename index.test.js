jest.mock('@google-cloud/firestore');
jest.mock('axios');

const getMocks = () => {
  let __mockReq = {
    headers: {},
    get: function(header) {
      return this.headers[header];
    },
    method: '',
    body: {},
    query: {},
    params: {},
  };

  let __mockRes = {
    set: jest.fn(),
    send: jest.fn(),
    json: jest.fn(),
    end: jest.fn(),
    status: jest.fn(),
  };

  return {
    req: __mockReq,
    res: __mockRes,
  };
};

describe('Test putFilesAttributes', () => {

  test('it should update the user', async () => {
    const microservice = require('./index');
    const parameters = {
      header: {
        token: '1qaz2wsx3edc4rfv',
      },
      query: {
        userId: '0okm9ijn8uhb',
      },
      body: {
        name: 'anna schmit',
        email: 'anna@gmail.com',
        phone: '+1 909 835 8022',
      },
    };
    const mockResponse = {
      status: 202 // authorized
    };
    require('axios').__setMockResponse(mockResponse);
    let mocks = getMocks();
    mocks.req.headers.authorization = `Beare ${parameters.header.token}`;
    mocks.req.method = 'POST';
    mocks.req.body = parameters.body;
    mocks.req.query = parameters.query;
    await microservice.putFilesAttributes(mocks.req, mocks.res);
    expect(mocks.res.status.mock.calls[0][0]).toBe(204);
    expect(mocks.res.end.mock.calls.length).toBe(1);
  });

});