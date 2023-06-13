const {
    deploy
} = require('./scripts');

(async () => {
  try {
    await deploy();
  } catch (error) {
    console.error(error);
  }
})();