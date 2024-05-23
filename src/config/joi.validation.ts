import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  APP_NAME: Joi.string().default('NestJS'),
  APP_PROD: Joi.boolean().default(false),
  APP_VERSION: Joi.string().default('0.0.1'),
  PORT: Joi.number().default(3000),
  
  APP_URL: Joi.string().default('http://localhost:3000'),
  FRONTEND_URL: Joi.string(),

});
