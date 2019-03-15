/**
 * Basic Realtime telemetry plugin using websockets.
 */


function RealtimeTelemetryPlugin() {
    return function (openmct) {
        //var socket = new WebSocket(location.origin.replace(/^http/, 'ws') + '/realtime/');
        //ws://127.0.0.1:8000/TlmyVar/
        
        const url = BASEWSURL + "TlmyVar/";
        var socket = new WebSocket(url);
        var listener = {};
        
        socket.onmessage = function (event) {      
            console.log("Event", event);      
            point = JSON.parse(event.data);
            //url = 
            //point = '[{timestamp: 1538427929000.0, value: "2", id: "LITUANICASAT2.OBCMCUTemperature"},{timestamp: 1538427971000.0, value: "2", id: "LITUANICASAT2.OBCMCUTemperature"}]';
            console.log("MUESTRO EVENT DATA", event.data);
            
            if (listener[point.id]) {
                console.log("LISTENER ENCONTRADOOOOO!!!!")
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
                //socket.send('subscribe ' + domainObject.identifier.key);
                socket.send(domainObject.identifier.key);
                return function unsubscribe() {
                    delete listener[domainObject.identifier.key];
                    socket.send(domainObject.identifier.key);
                };
            }
        };
        
        openmct.telemetry.addProvider(provider);
    }
}
