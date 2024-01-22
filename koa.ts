import Koa from 'koa';
import Router from '@koa/router';
import serveStatic from 'koa-static';
const conditional = require('koa-conditional-get');
const etag = require('koa-etag');

export { Koa, Router, serveStatic, conditional, etag };
