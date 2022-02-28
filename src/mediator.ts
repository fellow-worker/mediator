export type Handler = {
    event : string;
    handler : Function
 }

type HandlerMap = { [key: string]: Function; };

export class Mediator {

    private handlers : HandlerMap;

    constructor() {
        this.handlers = {};
    }

    register = (handler : Handler) => {
        if(this.handlers[handler.event] === undefined) this.handlers[handler.event] = handler.handler;
    }

    emit = async<TRequest,TResponse> (event : string, request? : TRequest) => {
        if(!this.handlers[event]) throw new Error(`Mediator has no registered action for event '${event}'`);
        const method = this.handlers[event];
        return await method(request) as TResponse;
    }

    isRegistered = (event : string) => {
        return this.handlers[event] !== undefined
    }
}

const singleton = new Mediator();

export const emit = async<TRequest,TResponse> (event : string, request : TRequest) => {
    return await getMediator().emit(event, request) as TResponse;
}

export const getMediator = () => { return singleton };

export const registerModule = (module : any) => {
    const mediator = getMediator();
    for(var propertyName in module) {
        const property = module[propertyName];
        if(!property || !property.event || !property.handler) return;
        mediator.register(property);
    }
}

export default Mediator;