// Get Development Env
require('./utilities/getEnv')();

const getToken = require('./utilities/getToken');
const getFirestore = require('./db/getFirestore');
const updateUser = require('./db/updateUser');
const getAuthorization = require('./services/getAuthorization');

let firestore;

const updateUserStep = async (req, res) => {
  try {
    const userId = req.query.userId;
    const name = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;
    firestore = getFirestore(firestore);
    await updateUser(firestore, userId, name, email, phone);
    res.status(204);
    res.end();  // send no content
  } catch (error) {
    console.error(error);
    res.status(401);
    res.end();  // send no content
  }
};


const getAuthorizationStep = async (req, res) => {
  try {
    const userId = req.query.userId;
    const token = req.userToken;
    const response = await getAuthorization(token, userId);
    if (response.status===202) {
      // authorized
      await updateUserStep(req, res);
    } else {
      // unauthorized
      console.log('the user ' + userId + ' is unauthorized');
      res.status(401);
      res.end();  // send no content
    }
  } catch (error) {
    console.error(error);
    res.status(401);
    res.end();  // send no content
  }
};

const getTokenStep = async (req, res) => {
  const myAuthentication = getToken(req.headers);
  if (myAuthentication===false) {
    // didn't find any token
    res.status(401);
    res.end();  // send no content
  } else {
    // populate it
    req.userToken = myAuthentication.token;
    await getAuthorizationStep(req, res);
    // saveAttributesStep(req, res); /** IMPORTANT */
  }
};

/**
 * HTTP Cloud Function.
 * This function is exported by index.js, and is executed when
 * you make an HTTP request to the deployed function's endpoint.
 *
 * @param {Object} req Cloud Function request context.
 *                     More info: https://expressjs.com/en/api.html#req
 * @param {Object} res Cloud Function response context.
 *                     More info: https://expressjs.com/en/api.html#res
 */
exports.putFilesAttributes = async (req, res) => {
  // const token = req.userToken;
  // const userId = req.query.userId;
  // const websiteId = req.query.websiteId;
  // const type = req.body.type;
  // const filename = req.body.filename;

  // Set CORS headers for preflight requests
  res.set('Access-Control-Allow-Origin', process.env.ACCESS_CONTROL_ALLOW_ORIGIN);
  res.set('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    // Send response to OPTIONS requests
    res.set('Access-Control-Allow-Methods', 'POST');
    res.set('Access-Control-Allow-Headers', 'Authorization, Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    res.status(204)
    res.end();
  } else {
    await getTokenStep(req, res);
  }
};