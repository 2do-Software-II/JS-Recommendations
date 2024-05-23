declare namespace NodeJS {
  interface ProcessEnv {
    APP_NAME: string;
    APP_PROD: boolean;
    PORT: number;
    
    APP_URL: string;
    FRONTEND_URL: string;

  }
}
