import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

Symbol.asyncIterator = Symbol.asyncIterator || Symbol('Symbol.asyncIterator');

const MethodUpdates = new Mongo.Collection('_generatorMethodUpdates', { connection: null });

async function runMethod(callId, context, handler, args) {
  const iterator = handler.call(context, ...args);

  let next;
  while (!(next = await iterator.next()).done) {
    const response = next.value;
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
  check(callId, Number);
  return MethodUpdates.find({ callId, user: this.userId });
}, { is_auto: true });
