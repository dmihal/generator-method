import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import 'babel-polyfill';


const MethodUpdates = new Mongo.Collection('_generatorMethodUpdates', { connection: null });

async function runMethod(callId, context, handler, args) {
  for await (const response of handler.call(context, ...args)) {
    MethodUpdates.insert({
      callId,
      user: context.userId,
      response,
    });
  }

  MethodUpdates.insert({
    callId,
    user: context.userId,
    done: true,
  });

  // TODO: cleanup updates from memory
}

let nextId = 1;
Meteor.generatorMethod = function generatorMethod(name, handler) {
  Meteor.methods({
    [name]: function generatorMethodHandler(...args) {
      const callId = nextId++;
      runMethod(callId, this, handler, args);
      return {
        callId,
      };
    },
  });
}

Meteor.publish('_generatorMethodUpdates', function methodUpdates(callId) {
  return MethodUpdates.find({ callId, user: this.userId });
});
