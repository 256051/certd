const nodeHttp = require('node:http');
const https = require('node:https');
const { HttpProxyAgent } = require('http-proxy-agent');
const { HttpsProxyAgent } = require('https-proxy-agent');
const { log } = require('./logger');

function createAgent(opts = {}) {
    let httpAgent;
    let
        httpsAgent;
    const httpProxy = opts.httpProxy || process.env.HTTP_PROXY || process.env.http_proxy;
    if (httpProxy) {
        log(`acme use httpProxy:${httpProxy}`);
        httpAgent = new HttpProxyAgent(httpProxy, opts);
    }
    else {
        httpAgent = new nodeHttp.Agent(opts);
    }
    const httpsProxy = opts.httpsProxy || process.env.HTTPS_PROXY || process.env.https_proxy;
    if (httpsProxy) {
        log(`acme use httpsProxy:${httpsProxy}`);
        httpsAgent = new HttpsProxyAgent(httpsProxy, opts);
    }
    else {
        httpsAgent = new https.Agent(opts);
    }
    return {
        httpAgent,
        httpsAgent,
    };
}

let defaultAgents = createAgent();

function getGlobalAgents() {
    return defaultAgents;
}

function setGlobalProxy(opts) {
    log('acme setGlobalProxy:', opts);
    defaultAgents = createAgent(opts);
}

class HttpError extends Error {
    // eslint-disable-next-line constructor-super
    constructor(error) {
        if (!error) {
            return;
        }
        super(error.message);

        this.message = error.message;
        const { message } = error;
        if (message && typeof message === 'string') {
            if (message.indexOf && message.indexOf('ssl3_get_record:wrong version number') >= 0) {
                this.message = `${message}(http协议错误，服务端要求http协议，请检查是否使用了https请求)`;
            }
            else if (message.indexOf('getaddrinfo EAI_AGAIN')) {
                this.message = `${message}(无法解析域名，请检查网络连接或dns配置)`;
            }
        }

        this.name = error.name;
        this.code = error.code;

        if (error.response) {
            this.status = error.response.status;
            this.statusText = error.response.statusText || error.code;
            this.response = {
                data: error.response.data,
            };
            if (!this.message) {
                this.message = this.statusText;
            }
        }

        let url = '';
        if (error.config) {
            this.request = {
                baseURL: error.config.baseURL,
                url: error.config.url,
                method: error.config.method,
                params: error.config.params,
                data: error.config.data,
            };
            url = (error.config.baseURL || '') + error.config.url;
        }
        if (url) {
            this.message = `${this.message}:${url}`;
        }
        const { stack, cause } = error;
        // delete this.cause;
        // delete this.stack;
        this.cause = cause;
        this.stack = stack;
        delete error.stack;
        delete error.cause;
        delete error.response;
        delete error.config;
        delete error.request;
        // logger.error(error);
    }
}

module.exports = {
    setGlobalProxy,
    createAgent,
    getGlobalAgents,
    HttpError,
};
