import "@babel/polyfill/noConflict";
import server from './server';

server.start({port: process.env.PORT || 4001}, () => {
    console.log('Server is up!');
});