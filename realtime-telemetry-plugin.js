/**
 * Basic Realtime telemetry plugin using websockets.
 */
function RealtimeTelemetryPlugin() {
    return function (openmct) {
        //var socket = new WebSocket(location.origin.replace(/^http/, 'ws') + '/realtime/');
        //ws://127.0.0.1:8000/TlmyVar/
        var socket = new WebSocket('ws://127.0.0.1:8000/TlmyVar/');
        var listener = {};
        
        socket.onmessage = function (event) {      
            console.log("Event", event);      
            point = JSON.parse(event.data);
            //url = 
            console.log("Pidiendo real time tlmy", point, event);
            if (listener[point.id]) {
                listener[point.id](point);
            }
        };

        socket.onopen = function(event){
            console.log("socket onopen",  event);
        }

        //socket.onerror = funcion(event){
        //    console.log("socket onerror",  event);
        //}
        
        var provider = {
            supportsSubscribe: function (domainObject) {
                return domainObject.type === 'example.telemetry';
            },
            subscribe: function (domainObject, callback) {
                
                listener[domainObject.identifier.key] = callback;
                socket.send('subscribe ' + domainObject.identifier.key);
                return function unsubscribe() {
                    delete listener[domainObject.identifier.key];
                    socket.send('unsubscribe ' + domainObject.identifier.key);
                };
            }
        };
        
        openmct.telemetry.addProvider(provider);
    }
}
