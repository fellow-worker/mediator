import Mediator, { getMediator, registerModule } from "./mediator";

it("singleton", () => {
    const mediator = getMediator();
    expect(mediator).not.toBeNull;
    expect(mediator).not.toBeUndefined;
});

it("register", () => {
    const handler = {
        event: "event",
        handler: () => {
            return 1;
        },
    };
    const mediator = new Mediator();
    mediator.register(handler);
    expect(mediator.isRegistered("event")).toBeTruthy;
});

it("not-registered", () => {
    const mediator = new Mediator();
    const isRegistered = mediator.isRegistered("event");
    expect(isRegistered).toBeTruthy;
});

it("emit", async () => {
    const method = jest.fn();
    const handler = {
        event: "event",
        handler: method,
    };
    const mediator = new Mediator();
    mediator.register(handler);
    await mediator.emit("event");
    expect(method).toBeCalledTimes(1);
});

it("emit-no-event", async () => {
    expect.assertions(1);
    const mediator = new Mediator();

    const result = await expect(mediator.emit("get-job"));
    result.rejects.toThrow("Mediator has no registered action for event 'get-job'");
});


it("register-module", async () => {
    const method = jest.fn();
    const module = {
        "get-job" : { handler : method, event : "get-job" },
        "set-job" : { handler : method, event :  "set-job" },
        "fake" : method
    };
    registerModule(module);
    const mediator = getMediator();
    expect(mediator.isRegistered("event")).toBeFalsy;
    expect(mediator.isRegistered("get-job")).toBeFalsy;
    expect(mediator.isRegistered("fake")).toBeFalsy;
});