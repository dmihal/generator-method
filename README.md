# generator-method

## Install

```
meteor add dmihal:generator-method
```

## Example

### Server:

```javascript
Meteor.generatorMethod('test', async function* test() {
  yield { status: 'start' };
  await wait(1);
  yield { status: 'running', stage: 1 };
  await wait(1);
  yield { status: 'running', stage: 2 };
  await wait(1);
  yield { status: 'running', stage: 3 };
  await wait(1);
  yield { status: 'done' };
});

function wait(seconds) {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}
```

### Client:

```javascript
async runSomeMethod() {
  const handle = Meteor.callGenerator('test');

  for await (const response of handle) {
    console.log(response);
  }
}
```
