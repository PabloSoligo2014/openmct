/**
 * Basic historical telemetry plugin.
 */

function HistoricalTelemetryPlugin() {
    return function install (openmct) {
        
        var provider = {
            supportsRequest: function (domainObject) {
                return domainObject.type === 'example.telemetry';
            },
            request: function (domainObject, options) {

                console.log("Pidiendo historic time tlmy", domainObject.identifier.key, options.start, options.end);
                //http://127.0.0.1:8000/API/TlmyVarList/FS2017.BattV/1536153300189/1536154200189
                var myurl = 'http://127.0.0.1:8000/API/TlmyVarList/' +
                domainObject.identifier.key+'/'+options.start+'/'+options.end;
               
                /*
                console.log("Mi url", myurl);
                var url = '/history/' +
                    domainObject.identifier.key +
                    '?start=' + options.start +
                    '&end=' + options.end;
                
                console.log("Final URL", url);
                */
                return http.get(myurl)
                    .then(function (resp) {
                        console.log(resp.data);
                        return resp.data;
                    });
            }
        };
    
        openmct.telemetry.addProvider(provider);
    }
}