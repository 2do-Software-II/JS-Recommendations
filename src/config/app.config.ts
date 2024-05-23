export const EnvConfig = () => ({
  APP_NAME: process.env.APP_NAME || 'NestJS',
  APP_PROD: process.env.APP_PROD || false,
  APP_VERSION: process.env.APP_VERSION || "0.0.1",
  DOCKER_IMAGE: process.env.DOCKER_IMAGE || "",
  PORT: process.env.PORT || 3000,

  APP_URL: process.env.APP_URL || 'http://localhost:3000',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:4200',
});
