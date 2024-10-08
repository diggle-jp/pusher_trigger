const core = require("@actions/core");
const Pusher = require("pusher");

jest.mock("@actions/core");
jest.mock("pusher");

const { run } = require("./index");

describe("Pusher Trigger Action", () => {
  let mockTrigger;

  beforeEach(() => {
    core.getInput = jest.fn().mockImplementation((name) => {
      const inputs = {
        app_id: "test-app-id",
        key: "test-key",
        secret: "test-secret",
        cluster: "test-cluster",
        channel: "test-channel",
        event: "test-event",
        body: '{"message": "Hello, World!"}',
      };
      return inputs[name];
    });

    mockTrigger = jest.fn().mockResolvedValue();
    Pusher.mockImplementation(() => ({
      trigger: mockTrigger,
    }));
  });

  test("正常に実行される", async () => {
    await run();

    expect(Pusher).toHaveBeenCalledWith({
      appId: "test-app-id",
      key: "test-key",
      secret: "test-secret",
      cluster: "test-cluster",
    });

    expect(mockTrigger).toHaveBeenCalledWith(
      "test-channel",
      "test-event",
      '{"message": "Hello, World!"}',
    );
  });

  test("エラーが発生した場合", async () => {
    const errorMessage = "テストエラー";
    core.getInput.mockImplementation(() => {
      throw new Error(errorMessage);
    });

    await run();

    expect(core.setFailed).toHaveBeenCalledWith(errorMessage);
  });
});
