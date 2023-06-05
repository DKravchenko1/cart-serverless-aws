import { NestFactory } from '@nestjs/core';
import serverlessExpress from '@vendia/serverless-express';
import helmet from 'helmet';
import { Callback, Context, Handler } from 'aws-lambda';
import { AppModule } from './app.module';

let server;

const port = process.env.PORT || 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.enableCors({
    origin: '*',
    credentials: true,
    methods: '*',
    allowedHeaders: '*',
  });

  await app.init();
  await app.listen(port);

  // const expressApp = app.getHttpAdapter().getInstance();
  // return serverlessExpress({ app: expressApp });
}

bootstrap().then(() => {
  console.log('Server started!');
  console.log('Docker');
  console.log('host', process.env.DATA_BASE_HOST);
});

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  console.log('lambda is called');
  server = server ?? (await bootstrap());
  console.log('lambda is called');
  return server(event, context, callback);
};
