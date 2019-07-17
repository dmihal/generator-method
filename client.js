import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

Symbol.asyncIterator = Symbol.asyncIterator || Symbol('Symbol.asyncIterator');

const MethodUpdates = new Mongo.Collection('_generatorMethodUpdates');

Meteor.callGenerator = function callGenerator(...args) {
  const updates = [];
  const resolvers = {};
  let index = 0;

  Meteor.call(...args, (err, { callId }) => {
    if (!callId) {
      throw new Meteor.Error('Method is not a yeilding method');
    }

    const subscription = Meteor.subscribe('_generatorMethodUpdates', callId);
    const observer = MethodUpdates.find({ callId }).observe({
      added(doc) {
        if (doc.done) {
          observer.stop();
          subscription.stop();
        }

        const update = {
          value: doc.error ? Promise.reject(doc.error) : doc.response,
          done: doc.done,
        };

        const length = updates.push(update);
        if (resolvers[length - 1]) {
          resolvers[length - 1](update);
        }
      }
    });
  });

  return {
    next() {
      if (updates[index]) {
        const update = updates[index];
        index += 1;
        return Promise.resolve(update);
      }

      const newPromise = new Promise((resolve) => {
        resolvers[index] = resolve;
      });

      index += 1;
      return newPromise;
    },

    [Symbol.asyncIterator]() {
      return this;
    },
  };
}
