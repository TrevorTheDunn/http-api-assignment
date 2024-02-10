// function that processes the response using a passed in
// content variable, type variable, and statusCode variable
const respond = (request, response, content, type, statusCode) => {
  response.writeHead(statusCode, { 'Content-Type': type });

  response.write(content);

  response.end();
};

//function for processing the request, takes in the request, response, a content json,
//accepted types, and a status code. determines if xml or json and then calls respond 
//once it has constructed the string
const processRequest = (request, response, content, acceptedTypes, statusCode) => {
  //Prints out xml if the accepted type is xml
  if (acceptedTypes[0] === 'text/xml') {
    let msgXML = `<response><message>${content.message}</message>`;
    if (content.id) { msgXML += `<id>${content.id}</id>`; }
    msgXML += '</response>';
    return respond(request, response, msgXML, 'text/xml', statusCode);
  }
  
  //prints out json
  const msgString = JSON.stringify(content);
  return respond(request, response, msgString, 'application/json', statusCode);
};

//function for /success: sends a JSON with a message and calls 
//processRequest with a 200 status code
const success = (request, response, params, acceptedTypes) => {
  const responseJSON = {
    message: 'This is a successful response',
  };
  return processRequest(request, response, responseJSON, acceptedTypes, 200);
};

//function for /badRequest: determines if the parameters are present or missing,
//if they are missing, the JSON's message gets changed and an id is added and then processRequest
//is called with a 400 status code,
//otherwise the original message is used if the params are present and a status code of 200 is 
//passed into processRequest
const badRequest = (request, response, params, acceptedTypes) => {
  const responseJSON = {
    message: 'This request has the required parameters',
  };

  if (!params.valid || params.valid !== 'true') {
    responseJSON.message = 'Missing valid query parameter set to true';

    responseJSON.id = 'badRequest';

    return processRequest(request, response, responseJSON, acceptedTypes, 400);
  }

  return processRequest(request, response, responseJSON, acceptedTypes, 200);
};

//function for /unauthorized: determines if the parameters are present or missing
//if they are missing, the JSON's message gets changed and an id is added and then processRequest
//is called with a 401 status code,
//otherwise the original message is used if the params are prsent and a status code of 200 is
//passed into processRequest
const unauthorized = (request, response, params, acceptedTypes) => {
  const responseJSON = {
    message: 'This request has the required parameters',
  };

  if (!params.loggedIn || params.loggedIn !== 'yes') {
    responseJSON.message = 'Missing loggedIn query parameter set to yes';

    responseJSON.id = 'unauthorized';

    return processRequest(request, response, responseJSON, acceptedTypes, 401);
  }

  return processRequest(request, response, responseJSON, acceptedTypes, 200);
};

//function for /forbidden: sends a JSON with a message and id into processRequest with a
//status code of 403
const forbidden = (request, response, params, acceptedTypes) => {
  const responseJSON = {
    message: 'You do not have access to this content',
    id: 'forbidden',
  };
  return processRequest(request, response, responseJSON, acceptedTypes, 403);
};

//function for /internal: sends a JSON with a message and id into processRequest with a
//status code of 500
const internal = (request, response, params, acceptedTypes) => {
  const responseJSON = {
    message: 'Internal Server Error. Something went wrong.',
    id: 'internalError',
  };
  return processRequest(request, response, responseJSON, acceptedTypes, 500);
};

//function for /notImplemented: sends a JSON with a message and id into processRequest with a
//status code of 501
const notImplemented = (request, response, params, acceptedTypes) => {
  const responseJSON = {
    message: 'A get request for this page has not been implemented yet. Check again later for updated content.',
    id: 'notImplemented',
  };
  return processRequest(request, response, responseJSON, acceptedTypes, 501);
};

//function for notFound: sends a JSON with a message and id into processRequest with a 
//status code of 404
const notFound = (request, response, params, acceptedTypes) => {
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };
  return processRequest(request, response, responseJSON, acceptedTypes, 404);
};

//public exports
module.exports = {
  success,
  badRequest,
  unauthorized,
  forbidden,
  internal,
  notImplemented,
  notFound,
};
