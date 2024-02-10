const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const responseHandler = require('./responses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

//Url struct for determining what method is called for which url
const urlStruct = {
  '/': htmlHandler.getIndex,
  '/style.css': htmlHandler.getCSS,
  '/success': responseHandler.success,
  '/badRequest': responseHandler.badRequest,
  '/unauthorized': responseHandler.unauthorized,
  '/forbidden': responseHandler.forbidden,
  '/internal': responseHandler.internal,
  '/notImplemented': responseHandler.notImplemented,
  notFound: responseHandler.notFound,
};

//onRequest method, takes in a request and response
const onRequest = (request, response) => {
  //parses the url and gets the parameters
  const parsedUrl = url.parse(request.url);
  const params = query.parse(parsedUrl.query);

  //retrieves the accepted types from the header
  const acceptedTypes = request.headers.accept.split(',');

  //calls the url's method based on the url struct, and if the passed url
  //doesn't have a method, calls notFound
  const handlerFunc = urlStruct[parsedUrl.pathname];
  if (handlerFunc) {
    handlerFunc(request, response, params, acceptedTypes);
  } else {
    urlStruct.notFound(request, response, params, acceptedTypes);
  }
};

http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1: ${port}`);
});
