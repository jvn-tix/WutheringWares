const errorHandler = require('./middleware/errorMiddleware');

app.use(errorHandler);

const helmet = require('helmet');

app.use(helmet());

const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: 'Too many requests'
});

app.use('/api/auth/login', limiter);

const morgan = require('morgan');

app.use(morgan('dev'));

const {
  swaggerUi,
  swaggerSpec
} = require('./config/swagger');

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);