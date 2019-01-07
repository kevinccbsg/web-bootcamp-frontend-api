const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const errorResponses = require('./errorResponses');
const storageModule = require('./storage');
const swaggerDocument = require('./swaggerDocument.json');

const debug = require('debug')('Quote:Api');
const PORT = process.env.PORT || 3000;
const app = express();

const storage = storageModule();

app.use(cors());
app.use(logger(':method :url :status :response-time ms - :res[content-length]'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get('/api/v1/quote/:id', (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    const err = new Error('404');
    err.status = 404;
    return next(err);
  } 
  res.json(storage.getQuote(id));
});

app.post('/api/v1/quote/:id', (req, res, next) => {
  const { id } = req.params;
  const { quote } = req.body;
  console.log(req.body);
  if (!id) {
    const err = new Error('404');
    err.status = 404;
    return next(err);
  }
  res.json(storage.saveQuote(id, { quote, date: new Date() }));
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
