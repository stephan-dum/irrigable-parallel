const { Transform } = require("stream");

class ParallelTransform extends Transform {
  constructor(pipes, parent) {
    super({ objectMode : true });

    this.pipes = pipes;
  }
  _transform(vinyl, encoding, callback) {
    Promise.all(
      this.pipes.map((pipe) => new Promise((resolve, reject) => {
        pipe.write(vinyl, (error) => {
          if(error) {
            return reject(error);
          }

          resolve();
        });
      }))
    ).then(
      () => { callback(null, vinyl); },
      callback
    );
  }
}

module.exports = ParallelTransform;
