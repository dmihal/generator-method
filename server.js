import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

Symbol.asyncIterator = Symbol.asyncIterator || Symbol('Symbol.asyncIterator');

const MethodUpdates = new Mongo.Collection('_generatorMethodUpdates', { connection: null });

async function runMethod(callId, context, handler, args) {
  try {
    const iterator = handler.call(context, ...args);

    let next;
    while (!(next = await iterator.next()).done) {
      const response = next.value;
      MethodUpdates.insert({
        callId,
        connection: context.connection.id,
        response,
      });
    }

    MethodUpdates.insert({
      callId,
      connection: context.connection.id,
      done: true,
    });
  } catch (e) {
    MethodUpdates.insert({
      callId,
      error: e.toString(),
      connection: context.connection.id,
      done: true,
    });
  }
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

  const query = { callId, connection: this.connection.id };
  const cleanupUpdates = () => MethodUpdates.remove(query);

  this.onStop(cleanupUpdates);
  this.connection.onClose(cleanupUpdates);

  return MethodUpdates.find(query, {
    fields: { connection: 0 },
  });
}, { is_auto: true });
