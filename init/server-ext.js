'use strict';

const _ = require('lodash');
const Boom = require('boom');
const mongoose = require('mongoose');

module.exports = function(server) {
  server.ext('onPreResponse', onPreResponse);
};

function onPreResponse(request, reply) {
  const response = request.response;
  var newResponse = null;

  if (response.isBoom) {
    // reformat validation errors
    if (response.data && response.data.isJoi) { // Joi
      const errors = {};

      response.data.details.forEach(function(err) {
        errors[err.path] = _.merge({type: err.type}, _.omit(err.context, ['key']));
      });

      newResponse = Boom.badRequest('ValidationError', errors);
      newResponse.output.payload.errors = errors;
    }
    else if (response instanceof mongoose.Error.ValidationError) { // Mongoose
      const errors = {};

      Object.keys(response.errors).forEach(function(key) {
        const err = response.errors[key];

        errors[key] = _.merge({type: err.kind}, _.omit(err.properties, ['type', 'message', 'path']));
      });

      newResponse = Boom.badRequest('ValidationError', errors);
      newResponse.output.payload.errors = errors;
    }
    else if (response.isServer)
      console.error(response.stack);
  }

  return newResponse ? reply(newResponse) : reply.continue();
}
