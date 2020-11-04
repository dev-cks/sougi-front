(function(self) {
    var decoder;
    var Module = {};

    // const FastSound = require('fast-sound');
    // FastSound({
    //     locateFile: file => {
    //         return "/node_modules/fast-sound/dist/" + file;
    //     }
    // }).then(lib => {
    //     Module = lib;
    //     Module["getValue"] = getValue;
    //     self.postMessage({ type: 'ready' });
    // });

    function getValue(ptr, type) {
        type = type || 'i8';
        if (type.charAt(type.length - 1) === '*') type = 'i32'; // pointers are 32-bit
        switch (type) {
            case 'i1':
                return Module.HEAP8[((ptr) >> 0)];
            case 'i8':
                return Module.HEAP8[((ptr) >> 0)];
            case 'i16':
                return Module.HEAP16[((ptr) >> 1)];
            case 'i32':
                return Module.HEAP32[((ptr) >> 2)];
            case 'i64':
                return Module.HEAP32[((ptr) >> 2)];
            case 'float':
                return Module.HEAPF32[((ptr) >> 2)];
            case 'double':
                return Module.HEAPF64[((ptr) >> 3)];
            default:
                abort('invalid type for setValue: ' + type);
        }
        return null;
    }



    // worker handler
    self.onmessage = e => {
        switch (e.data.type) {
            case 'init':
                //decoder = new Decoder(e.data.config.sampleRate, e.data.config.channels);
                break;
            case 'decode':
                let data = e.data.buffer;
                self.postMessage({
                  type: 'data',
                  payload: data // Serialized Uint8Array
                });

                break;
            case 'destroy':
                decoder.destroy();
                break;
            default:
                self.postMessage(e.data);
        }
    }

})(self);
