const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const expressJSDocSwagger = require('express-jsdoc-swagger');
const errorResponses = require('./errorResponses');
const storageModule = require('./storage');

const debug = require('debug')('Quote:Api');
const PORT = process.env.PORT || 3000;
const app = express();

const storage = storageModule();

const swaggerOptions = {
  info: {
    description: 'Documentation for Quotes REST API',
    title: 'QuotesAPI',
    version: '1.0.0',
    contact: {
      name: 'Kevin Martínez',
      email: 'kevinccbsg@gmail.com',
    },
  },
  servers: [],
  baseDir: __dirname,
  filesPattern: './app**.js',
};

app.use(cors());
app.use(logger(':method :url :status :response-time ms - :res[content-length]'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  debug('Index routes');
  return res.status(200).send(`
    <div>
      <h1>Quotes API</h1>
      <ul>
        <li>
          <a href="/api-docs">/api-docs</a>
        </li>
        <li>
          <a href="/api/v1/quote/:id">GET /api/v1/quote/:id</a>
        </li>
        <li>
          <a href="/api/v1/quote/:id">POST /api/v1/quote/:id</a>
        </li>
      </ul>
    </div>
  `);
});

expressJSDocSwagger(app)(swaggerOptions);


/**
 * @typedef {object} Error
 * @property {number} statusCode - <span style="color: gray;font-style: italic">404</span>
 * @property {string} error - <span style="color: gray;font-style: italic">example: Error description message</span>
 */


/**
 * @typedef {object} Quote
 * @property {number} text - Quote text
 * @property {string} date - Quote date - date
 */

/**
 * @typedef {object} QuoteRequest
 * @property {number} text - Quote text
 */

/**
 * GET /api/v1/quote/{id}
 * @summary This an endpoint to retrieve quotes
 * @tags Quotes - Everything about Quotes
 * @param {string} id.path.required - Order Id
 * @return {Quote} 200 - Success response
 * @return {Error} default - Error
 */
app.get('/api/v1/quote/:id', (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    const err = new Error('404');
    err.status = 404;
    return next(err);
  } 
  res.json(storage.getQuote(id));
});

/**
 * POST /api/v1/quote/{id}
 * @summary This an endpoint to create quotes
 * @tags Quotes - Everything about Quotes
 * @param {string} id.path.required - Quote Id
 * @param {QuoteRequest} request.body.required - Quote text
 * @return {Quote} 200 - Success response
 * @return {Error} default - Error
 */
app.post('/api/v1/quote/:id', (req, res, next) => {
  const { id } = req.params;
  const { text } = req.body;
  if (!id) {
    const err = new Error('404');
    err.status = 404;
    return next(err);
  }
  res.json(storage.saveQuote(id, { text, date: new Date() }));
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('404');
  err.status = 404;
  return next(err);
});

app.use((err, req, res, next) => { // eslint-disable-line
  debug(err.stack);
  const { status, error } = errorResponses(err.message);
  return res.status(status).json({
    success: false,
    error,
  });
});

app.listen(PORT, () => debug(`Listening on PORT: ${PORT}`))
