

(function(self) {
    var encoder;


    // const FastSound = require('fast-sound');
    // FastSound({
    //     locateFile: file => {
    //         return "/node_modules/fast-sound/dist/" + file;
    //     }
    // }).then(lib => {
    //     Module = lib;
    //     Module["getValue"] = getValue;
    //     Module["setValue"] = setValue;
    //     self.postMessage({ type: 'ready' });
    // });





    // worker handler
    self.onmessage = e => {
        switch (e.data.type) {

            case 'init':

                break;
            case 'encode':
                let data = e.data.buffer;
                if (data) {
                    self.postMessage({
                        type: 'data',
                        payload: data // Serialized Uint8Array
                    });
                }
                break;
            case 'error':
                let error = e.data.error;
                self.postMessage({
                  type: 'error',
                  error: error
                });
                break;
            case 'destroy':
                encoder.destroy();
                break;
            case 'setBitrate':
                encoder.setBitrate(e.data.value);
                break;
            default:
        }
    }
})(self);
