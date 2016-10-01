import express from 'express';
import routes from './routes';

// start immediately
// const app = express();

// app.use('/', routes);
//
// app.listen(3000, () => {
//     console.log('running on port 3000');
// })


// start via function call.
function start(port = 3000) {
    const app = express();

    app.use('/', routes);

    const server = app.listen(port, () => {
          console.log('running on port 3000');
    });

    return server;
}
export {
    start
};
