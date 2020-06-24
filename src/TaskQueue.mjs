
export default class TaskQueue {

  constructor() {
    const queue = [];
    this._TaskQueue = {
      queue
    };

    this.join = this.join.bind(this);
    this.getLength = this.getLength.bind(this);
    this.createTask = this.createTask.bind(this);
  }

  createTask(cb) {
    
    let reject = null;
    let resolve = null;
    const { queue } = this._TaskQueue;

    const promise = new Promise((_resolve, _reject) => {
      const createWrapper = (cb) => {
        return arg => {
          const pos = queue.indexOf(promise);
          if(pos === -1) {
            return;
          }
          queue.splice(pos, 1);
          cb(arg);
        };
      };

      reject = createWrapper(_reject);
      resolve = createWrapper(_resolve);
    });
    
    queue.push(promise);
    
    if(typeof cb === 'function') {
      (async () => {
        try {
          const result = await cb(resolve, reject);
          if(typeof result !== 'undefined') {
            resolve(result);
          }
        } catch(err) {
          console.error(err);
          reject(err);
        }
      })();
    }

    return {
      reject,
      resolve
    };
  }

  async join() {
    const { queue } = this._TaskQueue;
    while(queue.length) {
      await Promise.race(queue);
    }
  }

  getLength() {
    return this._TaskQueue.queue.length;
  }

}