const core = require("@actions/core");
const Pusher = require("pusher");

async function run() {
  try {
    const appId = core.getInput("app_id", { required: true });
    const key = core.getInput("key", { required: true });
    const secret = core.getInput("secret", { required: true });
    const cluster = core.getInput("cluster", { required: true });
    const channel = core.getInput("channel", { required: true });
    const event = core.getInput("event", { required: true });
    const body = core.getInput("body");
    const pusher = new Pusher({
      appId,
      key,
      secret,
      cluster
    });
    pusher.trigger(channel, event, body);
  } catch (error) {
    core.setFailed(error.message);
    core.debug(error.stack);
  }
}

run();
