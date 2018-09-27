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
    return http.get('/FS2017-dictionary.json')
        .then(function (result) {
            return result.data;
        });
}

function getLituanicasat2Dictionary(){
    return http.get('/Lituanicasat2-dictionary.json')
        .then(function (result) {
            return result.data;
        });
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

        openmct.objects.addProvider('fs2017.spacecraft', FS2017TelemetryMetadataProvider);
        openmct.objects.addProvider('lituanicasat2.spacecraft', Lituanicasat2TelemetryMetadataProvider);

        openmct.types.addType('example.telemetry', {
            name: 'Telemetry',
            description: 'Telemetry point.',
            cssClass: 'icon-telemetry'
        });

        openmct.composition.addProvider(FS2017CompositionProvider);
        openmct.composition.addProvider(Lituanicasat2CompositionProvider);
    }
};

