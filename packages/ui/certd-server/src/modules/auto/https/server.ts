import https from 'node:https';
import fs from 'fs';
import { Application } from '@midwayjs/koa';
import { createSelfCertificate } from './self-certificate.js';
import { logger } from '@certd/pipeline';

export type HttpsServerOptions = {
  enabled: boolean;
  app?: Application;
  port: number;
  key: string;
  cert: string;
};

export async function startHttpsServer(opts: HttpsServerOptions) {
  logger.info('=========================================');
  if (!opts.key || !opts.cert) {
    logger.error('证书路径未配置，无法启动https服务，请先配置：koa.https.key和koa.https.cert');
    return;
  }

  if (!fs.existsSync(opts.key) || !fs.existsSync(opts.cert)) {
    logger.info('证书文件不存在,将生成自签名证书');
    createSelfCertificate({
      crtPath: opts.cert,
      keyPath: opts.key,
    });
  }
  logger.info('准备启动https服务');
  const httpServer = https.createServer(
    {
      cert: fs.readFileSync(opts.cert),
      key: fs.readFileSync(opts.key),
    },
    opts.app.callback()
  );
  const hostname = '0.0.0.0';
  // A function that runs in the context of the http server
  // and reports what type of server listens on which port
  function listeningReporter() {
    // `this` refers to the http server here
    logger.info(`Https server is listening on https://${hostname}:${opts.port}`);
  }
  try {
    httpServer.listen(opts.port, hostname, listeningReporter);
  } catch (e) {
    logger.error('启动https服务失败', e);
  }
}
