'use strict';

const clients = new Map();

const ChatService = {

    register(name, listener) {
        if(clients.has(name)) {
            throw new Error(`The client ${name} is already registered`);
        }
        if(typeof listener !== 'function') {
            throw new Error(`Listener must be a function`);
        }
        clients.set(name, listener);
    },

    unregister(name) {
        clients.delete(name, listener);
    },

    publish(from, message) {
        for(let [name, listener] of clients) {
            if(from !== name) {
                listener.call(null, {from, message});
            }
        }
    },

    
    replyTo(from, to, message) {
        if(clients.has(from) && clients.has(to)) {
            clients.get(to).call(null, {from, message:`${from} >> ${message}`});
        }
    },

    killAll() {
        for(let [name, listener] of clients) {
            clients.delete(name, listener);
        }
    }

}

module.exports = ChatService;