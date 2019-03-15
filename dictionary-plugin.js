/*
Nuevo documento para la integracion de la telemetria
*/




function getDictionary() {
    return http.get('/dictionary.json')
        .then(function (result) {
            return result.data;
        });
}

var objectProvider = {
    get: function (identifier) {
        return getDictionary().then(function (dictionary) {
            if (identifier.key === 'telemetry') {
                return {
                    identifier: identifier,
                    name: dictionary.name,
                    type: 'folder',
                    location: 'ROOT'
                };
            }            
        });
    }
};


var objectTelemtryProvider = {
    get: function (identifier){
        console.log(identifier);

        return Promise.resolve({
            identifier: identifier.key,
            name: identifier.key,
            type: 'folder',
            location: 'ROOT'
        });
    }
};

function DictionaryPlugin() {
    return function install(openmct) {
        openmct.objects.addRoot({
            namespace: 'TelemetryGroup',
            key: 'telemetry'
        });
        //Parece que el nombre del  provider debe coincidir con el namespace del root... 
        openmct.objects.addProvider('TelemetryGroup', objectTelemtryProvider);
    }
};


function getFS2017Dictionary() {
    /*
    return http.get('/FS2017-dictionary.json')
        .then(function (result) {
            return result.data;
        });
    */
   const url = BASEURL + "API/TlmyVarDict/FS2017";
   return http.get(url)
        .then(function (result) {
            //console.log(result.data);
            return result.data;

        });
}

function getSACDDictionary() {
    /*
    return http.get('/FS2017-dictionary.json')
        .then(function (result) {
            return result.data;
        });
    */
   const url = BASEURL + "API/TlmyVarDict/SACD";
   
   return http.get(url)
        .then(function (result) {
            //console.log(result.data);
            return result.data;

        });
}


function getTitaDictionary() {
    /*
    return http.get('/FS2017-dictionary.json')
        .then(function (result) {
            return result.data;
        });
    */
   const url = BASEURL + "API/TlmyVarDict/TITA"; 
   return http.get(url)
        .then(function (result) {
            //console.log(result.data);
            return result.data;

        });
}

function getLituanicasat2Dictionary(){
    
    const url = BASEURL + "API/TlmyVarDict/TITA"
    return http.get(url)
    .then(function (result) {
        //console.log(result.data);
        return result.data;

    });
    /*
    return http.get('/Lituanicasat2-dictionary.json')
        .then(function (result) {
            return result.data;
        });
        */
}


var Lituanicasat2TelemetryMetadataProvider = {
    get: function (identifier) {
        return getLituanicasat2Dictionary().then(function (dictionary) {
            if (identifier.key === 'spacecraft') {
                //console.log("Dictname->",dictionary.name);
                return {
                    identifier: identifier,
                    name: dictionary.name,
                    type: 'folder',
                    location: 'ROOT'
                };
            }else{
                var measurement = dictionary.measurements.filter(function (m) {
                    return m.key === identifier.key;
                })[0];
                return {
                    identifier: identifier,
                    name: measurement.name,
                    type: 'example.telemetry',
                    telemetry: {
                        values: measurement.values
                    },
                    location: 'lituanicasat2.spacecraft:spacecraft'
                };
            }
        });
    }
};

var FS2017TelemetryMetadataProvider = {
    get: function (identifier) {
        return getFS2017Dictionary().then(function (dictionary) {
            if (identifier.key === 'spacecraft') {
                //console.log("Dictname->",dictionary.name);
                return {
                    identifier: identifier,
                    name: dictionary.name,
                    type: 'folder',
                    location: 'ROOT'
                };
            }else{
                var measurement = dictionary.measurements.filter(function (m) {
                    return m.key === identifier.key;
                })[0];
                return {
                    identifier: identifier,
                    name: measurement.name,
                    type: 'example.telemetry',
                    telemetry: {
                        values: measurement.values
                    },
                    location: 'fs2017.spacecraft:spacecraft'
                };
            }
        });
    }
};

var TitaTelemetryMetadataProvider = {
    get: function (identifier) {
        return getTitaDictionary().then(function (dictionary) {
            if (identifier.key === 'spacecraft') {
                //console.log("Dictname->",dictionary.name);
                return {
                    identifier: identifier,
                    name: dictionary.name,
                    type: 'folder',
                    location: 'ROOT'
                };
            }else{
                var measurement = dictionary.measurements.filter(function (m) {
                    return m.key === identifier.key;
                })[0];
                return {
                    identifier: identifier,
                    name: measurement.name,
                    type: 'example.telemetry',
                    telemetry: {
                        values: measurement.values
                    },
                    location: 'tita.spacecraft:spacecraft'
                };
            }
        });
    }
};

var SACDTelemetryMetadataProvider = {
    get: function (identifier) {
        return getSACDDictionary().then(function (dictionary) {
            if (identifier.key === 'spacecraft') {
                //console.log("Dictname->",dictionary.name);
                return {
                    identifier: identifier,
                    name: dictionary.name,
                    type: 'folder',
                    location: 'ROOT'
                };
            }else{
                var measurement = dictionary.measurements.filter(function (m) {
                    return m.key === identifier.key;
                })[0];
                return {
                    identifier: identifier,
                    name: measurement.name,
                    type: 'example.telemetry',
                    telemetry: {
                        values: measurement.values
                    },
                    location: 'sacd.spacecraft:spacecraft'
                };
            }
        });
    }
};



var FS2017CompositionProvider = {
    appliesTo: function (domainObject) {
        return domainObject.identifier.namespace === 'fs2017.spacecraft' && domainObject.type === 'folder';
    },
    load: function (domainObject) {
        //Aca retorna las variables de telemetria, no los valores
        return getFS2017Dictionary().then(function (dictionary) {
                return dictionary.measurements.map(function (m) {
                    return {
                        namespace: 'fs2017.spacecraft',
                        key: m.key
                    };
                });
            });
    }
};

var Lituanicasat2CompositionProvider = {
    appliesTo: function (domainObject) {
        return domainObject.identifier.namespace === 'lituanicasat2.spacecraft' && domainObject.type === 'folder';
    },
    load: function (domainObject) {
        //Aca retorna las variables de telemetria, no los valores
        return getLituanicasat2Dictionary().then(function (dictionary) {
                return dictionary.measurements.map(function (m) {
                    return {
                        namespace: 'lituanicasat2.spacecraft',
                        key: m.key
                    };
                });
            });
    }
};

var TitaCompositionProvider = {
    appliesTo: function (domainObject) {
        return domainObject.identifier.namespace === 'tita.spacecraft' && domainObject.type === 'folder';
    },
    load: function (domainObject) {
        //Aca retorna las variables de telemetria, no los valores
        return getTitaDictionary().then(function (dictionary) {
                return dictionary.measurements.map(function (m) {
                    return {
                        namespace: 'tita.spacecraft',
                        key: m.key
                    };
                });
            });
    }
};

var SACDCompositionProvider = {
    appliesTo: function (domainObject) {
        return domainObject.identifier.namespace === 'sacd.spacecraft' && domainObject.type === 'folder';
    },
    load: function (domainObject) {
        //Aca retorna las variables de telemetria, no los valores
        return getSACDDictionary().then(function (dictionary) {
                return dictionary.measurements.map(function (m) {
                    return {
                        namespace: 'sacd.spacecraft',
                        key: m.key
                    };
                });
            });
    }
};


function SpacecraftPlugin() {
    return function install(openmct) {
        openmct.objects.addRoot({
            namespace: 'fs2017.spacecraft',
            key: 'spacecraft'
        });
        
        openmct.objects.addRoot({
            namespace: 'lituanicasat2.spacecraft',
            key: 'spacecraft'
        });

        openmct.objects.addRoot({
            namespace: 'tita.spacecraft',
            key: 'spacecraft'
        });

        openmct.objects.addRoot({
            namespace: 'sacd.spacecraft',
            key: 'spacecraft'
        });

        
        openmct.objects.addProvider('fs2017.spacecraft', FS2017TelemetryMetadataProvider);
        openmct.objects.addProvider('lituanicasat2.spacecraft', Lituanicasat2TelemetryMetadataProvider);
        openmct.objects.addProvider('tita.spacecraft', TitaTelemetryMetadataProvider);
        openmct.objects.addProvider('sacd.spacecraft', SACDTelemetryMetadataProvider);
        

        openmct.types.addType('example.telemetry', {
            name: 'Telemetry',
            description: 'Telemetry point.',
            cssClass: 'icon-telemetry'
        });

        openmct.composition.addProvider(FS2017CompositionProvider);
        openmct.composition.addProvider(Lituanicasat2CompositionProvider);
        openmct.composition.addProvider(TitaCompositionProvider);
        openmct.composition.addProvider(SACDCompositionProvider);
        
    }
};

