
class PublishSubscribe{
    events: Map<string, Array<(data: unknown) => void>>;
    constructor(){
        this.events = new Map()
    }
    
    subscribe(event: string, handler: (data: unknown) => void) {
        if(!this.events.has(event)){
            this.events.set(event, [])
        }

        if (this.events.has(event)) {
            const e = this.events.get(event);
            if (e) {
                e.push(handler)
            }
        }
    }

    unsubscribe(event: string, handler: (data: unknown) => void){
        if(this.events.has(event)) {
            const e = this.events.get(event);
            if (e) {
                const index = e.findIndex(item => item === handler)
                e.splice(index, 1);
            }
        }
    }

    publish(event: string, data: unknown){
        if(this.events.has(event)){
            const e = this.events.get(event);
            if (e) {
                e.forEach(handler => handler(data));
            }
        }
    }
}

export default PublishSubscribe;