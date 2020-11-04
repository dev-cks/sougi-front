let context;
let background;
let opus;
var Module = {};
var encoder;
var decoder;
import FastSound from 'fast-sound';
function init_context() {
    if (context === undefined) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        context = new AudioContext();
    }
}

function setValue(ptr, value, type) {
  type = type || 'i8';
  if (type.charAt(type.length - 1) === '*') type = 'i32'; // pointers are 32-bit
  switch (type) {
    case 'i1':
      Module.HEAP8[((ptr) >> 0)] = value;
      break;
    case 'i8':
      Module.HEAP8[((ptr) >> 0)] = value;
      break;
    case 'i16':
      Module.HEAP16[((ptr) >> 1)] = value;
      break;
    case 'i32':
      Module.HEAP32[((ptr) >> 2)] = value;
      break;
    case 'i64':
      (tempI64 = [value >>> 0, (tempDouble = value, (+(Math_abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? ((Math_min((+(Math_floor((tempDouble) / 4294967296.0))), 4294967295.0)) | 0) >>> 0 : (~~((+(Math_ceil((tempDouble - +(((~~(tempDouble))) >>> 0)) / 4294967296.0))))) >>> 0) : 0)], Module.HEAP32[((ptr) >> 2)] = tempI64[0], Module.HEAP32[(((ptr) + (4)) >> 2)] = tempI64[1]);
      break;
    case 'float':
      Module.HEAPF32[((ptr) >> 2)] = value;
      break;
    case 'double':
      Module.HEAPF64[((ptr) >> 3)] = value;
      break;
    default:
      abort('invalid type for setValue: ' + type);
  }
}

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

function Encoder(application, frameDuration, sampleRate, originalRate, channels, params) {
  var err,
    bufSize,
    outSize;

  if (application === void 0) {
    application = 2049;
  }
  if (frameDuration === void 0) {
    frameDuration = 20;
  }
  if (sampleRate === void 0) {
    sampleRate = 48000;
  }
  this.resampler = null;
  this.bufPos = 0;
  err = Module._malloc(4);

  this.frameSize = sampleRate * frameDuration / 1000;
  this.channels = channels;
  this.handle = Module._opus_encoder_create(sampleRate, channels, application, err);

  if (params && params.cbr) {
    this.setConfig(0, 4006); // 4006 = OPUS_SET_VBR_REQUEST
  }
  if (params && params.bitRate) {
    this.setConfig(params.bitRate, 4002); // 4002 = OPUS_SET_BITRATE_REQUEST
  }
  if (params && params.forceChannel) {
    this.setConfig(params.forceChannel, 4022); // 4022 = OPUS_SET_FORCE_CHANNELS_REQUEST
  }
  if (params && params.expertFrameduration) {
    this.setConfig(params.expertFrameduration, 4040); // 4040 = OPUS_SET_EXPERT_FRAME_DURATION_REQUEST
  }
  if (params && params.predictionDisabled) {
    this.setConfig(0, 4042); // 4042 = OPUS_SET_PREDICTION_DISABLED_REQUEST
  }

  if (Module.getValue(err, "i32") != 0) {
    opus.postMessage({
      type: 'error',
      error: Module.getValue(err, "i32")
    });
    return;
  }
  if (sampleRate != originalRate) {
    try {
      this.resampler = new SpeexResampler(channels, originalRate, sampleRate)
    } catch (e) {
      opus.postMessage({
        type: 'error',
        error: e
      });
      return;
    }
  }
  Module._free(err);
  bufSize = 4 * this.frameSize * this.channels;
  this.bufPtr = Module._malloc(bufSize);
  this.buf = Module.HEAPF32.subarray(this.bufPtr / 4, (this.bufPtr + bufSize) / 4);
  outSize = 1275 * 3 + 7;
  this.outPtr = Module._malloc(outSize);
  this.out = Module.HEAPU8.subarray(this.outPtr, this.outPtr + outSize);
}
Encoder.prototype.encode = function(samples) {
  var size,
    ret,
    packets = [];

  if (this.resampler) {
    try {
      samples = this.resampler.process(samples);
    } catch (e) {
      opus.postMessage({
        type: 'error',
        error: e
      });
      return null;
    }
  }
  while (samples && samples.length > 0) {
    size = Math.min(samples.length, this.buf.length - this.bufPos);
    this.buf.set(samples.subarray(0, size), this.bufPos);
    this.bufPos += size;
    samples = samples.subarray(size);
    if (this.bufPos == this.buf.length) {
      this.bufPos = 0;
      ret = Module._opus_encode_float(this.handle, this.bufPtr, this.frameSize, this.outPtr, this.out.byteLength);
      if (ret < 0) {
        opus.postMessage({
          type: 'error',
          error: ret
        });
        break;
      }
      //result = (new Uint8Array(this.out.subarray(0, ret))).buffer;
      let result = new Uint8Array(this.out.subarray(0, ret));
      packets.push(result);
    }
  }
  if (packets.length > 0) {
    let total = 0;
    packets.forEach(function(elem) { total += elem.length + 2; }); // +2 means +uint16 for each packet size

    const data = new Uint8Array(total);
    const view = new DataView(data.buffer);
    let pos = 0;
    packets.forEach(function(elem) {
      view.setUint16(pos, elem.length); // set packet size
      pos += 2;
      data.set(elem, pos);
      pos += elem.length;
    });
    return data;
  }
  return null;
}
Encoder.prototype.setBitrate = function(bitrate) {
  this.setConfig(bitrate, 4002); // 4002 = OPUS_SET_BITRATE_REQUEST
}
Encoder.prototype.setConfig = function(value, constantNum) {
  var location = Module._malloc(4);
  Module.setValue(location, value, "i32");
  Module._opus_encoder_ctl(this.handle, constantNum, location);
  Module._free(location);
}
Encoder.prototype.destroy = function() {
  Module._opus_encoder_destroy(this.handle);
  if (this.resampler) {
    this.resampler.destroy();
  }
  this.handle = null;
  this.buf = null;
  this.pcm = null;
}

var SpeexResampler = (function() {
  function SpeexResampler(channels, inRate, outRate, quality) {
    if (quality === void 0) {
      quality = 5;
    }
    this.handle = 0;
    this.inPtr = 0;
    this.outPtr = 0;
    this.inCapacity = 0;
    this.inLenPtr = 0;
    this.outLenPtr = 0;
    this.channels = channels;
    this.inRate = inRate;
    this.outRate = outRate;
    var errPtr = Module._malloc(4);
    this.handle = Module._speex_resampler_init(channels, inRate, outRate, quality, errPtr);
    if (Module.getValue(errPtr, "i32") != 0)
      throw "speex_resampler_init failed: ret=" + Module.getValue(errPtr, "i32");
    Module._free(errPtr);
    this.inLenPtr = Module._malloc(4);
    this.outLenPtr = Module._malloc(4);
  }
  SpeexResampler.prototype.process = function(input) {
    if (!this.handle)
      throw "disposed object";
    var samples = input.length;
    var outSamples = Math.ceil(samples * this.outRate / this.inRate);
    var requireSize = samples * 4;
    if (this.inCapacity < requireSize) {
      if (this.inPtr)
        Module._free(this.inPtr);
      if (this.outPtr)
        Module._free(this.outPtr);
      this.inPtr = Module._malloc(requireSize);
      this.outPtr = Module._malloc(outSamples * 4);
      this.inCapacity = requireSize;
    }
    var ret;
    Module.setValue(this.inLenPtr, samples / this.channels, "i32");
    Module.setValue(this.outLenPtr, outSamples / this.channels, "i32");
    if (input.buffer == Module.HEAPF32.buffer) {
      ret = Module._speex_resampler_process_interleaved_float(this.handle, input.byteOffset, this.inLenPtr, this.outPtr, this.outLenPtr);
    } else {
      Module.HEAPF32.set(input, this.inPtr >> 2);
      ret = Module._speex_resampler_process_interleaved_float(this.handle, this.inPtr, this.inLenPtr, this.outPtr, this.outLenPtr);
    }
    if (ret != 0)
      throw "speex_resampler_process_interleaved_float failed: " + ret;
    var ret_samples = Module.getValue(this.outLenPtr, "i32") * this.channels;
    return Module.HEAPF32.subarray(this.outPtr >> 2, (this.outPtr >> 2) + ret_samples);
  };
  SpeexResampler.prototype.destroy = function() {
    if (!this.handle)
      return;
    Module._speex_resampler_destroy(this.handle);
    this.handle = 0;
    Module._free(this.inLenPtr);
    Module._free(this.outLenPtr);
    if (this.inPtr)
      Module._free(this.inPtr);
    if (this.outPtr)
      Module._free(this.outPtr);
    this.inLenPtr = this.outLenPtr = this.inPtr = this.outPtr = 0;
  };
  return SpeexResampler;
})();

function Decoder(sampleRate, channels) {
  this.channels = channels;
  var err = Module._malloc(4);
  this.handle = Module._opus_decoder_create(sampleRate, this.channels, err);
  var errNum = Module.getValue(err, "i32");
  Module._free(err);
  if (errNum != 0) {
    self.postMessage({
      type: 'error',
      error: errNum
    });
    return;
  }
  this.frameSize = sampleRate * 60 / 1000;
  var bufSize = 1275 * 3 + 7;
  var pcmSamples = this.frameSize * this.channels;
  this.bufPtr = Module._malloc(bufSize);
  this.pcmPtr = Module._malloc(4 * pcmSamples);
  this.buf = Module.HEAPU8.subarray(this.bufPtr, this.bufPtr + bufSize);
  this.pcm = Module.HEAPF32.subarray(this.pcmPtr / 4, this.pcmPtr / 4 + pcmSamples);
}

Decoder.prototype.decode = function(payload) {
  let pcmArray = [];
  let pcmLength = 0;
  let pos = 0;
  const view = new DataView(payload.buffer);
  while (pos < payload.byteLength) {
    const packet_size = view.getUint16(pos);
    pos += 2;
    //this.buf.set(new Uint8Array(payload.slice(pos, pos + packet_size)));
    this.buf.set(payload.slice(pos, pos + packet_size));
    pos += packet_size;

    var ret = Module._opus_decode_float(this.handle, this.bufPtr, packet_size, this.pcmPtr, this.frameSize, 0);
    if (ret < 0) {
      self.postMessage({
        type: 'error',
        error: ret
      });
      break;
    } else {
      const pcm = new Float32Array(this.pcm.subarray(0, ret * this.channels));
      pcmLength += pcm.length;
      pcmArray.push(pcm);
    }
  }
  if (pcmLength > 0) {
    // Flatten
    pos = 0;
    let pcmData = new Float32Array(pcmLength);
    pcmArray.forEach(function(pcm) {
      pcmData.set(pcm, pos);
      pos += pcm.length;
    });
    return pcmData;
  }
  return null;
}

Decoder.prototype.destroy = function() {
  Module._opus_decoder_destroy(this.handle);
  this.handle = null;
  this.buf = null;
  this.pcm = null;
}

export default {
    encoder: function(sample_rate, stereo, bit_rate) {
        if (opus === undefined) {
            opus = new Worker('static/lib/opus_enc.js');
            opus.sampleRate = sample_rate;
            opus.stereo = stereo;
            FastSound({
              locateFile: file => {
                return "/static/fast-sound/dist/" + file;
              }
            }).then(lib => {
              Module = lib;
              Module["getValue"] = getValue;
              Module["setValue"] = setValue;
              encoder = new Encoder(undefined, 20, sample_rate,
                sample_rate, stereo ? 2 : 1, {
                  cbr: false,
                  bitRate: bit_rate
                });
            });
        }
        return opus;
    },
    decoder: function(sample_rate, stereo) {
        if (opus === undefined) {
            opus = new Worker('static/lib/opus_dec.js');
            opus.sampleRate = sample_rate;
            opus.stereo = stereo;
            FastSound({
              locateFile: file => {
                return "/static/fast-sound/dist/" + file;
              }
            }).then(lib => {
              Module = lib;
              Module["getValue"] = getValue;
              decoder = new Decoder(sample_rate, stereo ? 2 : 1);
            });

        }
        return opus;
    },
    recorder: function(stream) {
        init_context();
        // attach audio
        const aStream = context.createMediaStreamSource(stream);
        let aRecorder;
        const BUFFER_SIZE = 16384;
        const channels = opus.stereo ? 2 : 1;
        if (context.createScriptProcessor) {
            aRecorder = context.createScriptProcessor(BUFFER_SIZE, channels, channels);
        } else {
            aRecorder = context.createJavaScriptNode(BUFFER_SIZE, channels, channels);
        }
        aStream.connect(aRecorder);
        return aRecorder;
    },
    encode: function(inputBuffer) {
        let pcmArray = [];
        for (let c = 0; c < inputBuffer.numberOfChannels; c++) {
            pcmArray.push(inputBuffer.getChannelData(c));
        }
        let data;
        if (pcmArray.length > 1) { // to interleave (stereo)
          const samples = new Float32Array(pcmArray[0].length * pcmArray.length);
          for (let i = 0; i < pcmArray[0].length; i++) {
            samples[i * pcmArray.length + 0] = pcmArray[0][i];
            samples[i * pcmArray.length + 1] = pcmArray[1][i];
          }
          data = encoder.encode(samples);
        } else {
          data = encoder.encode(pcmArray[0]);
        }
        opus.postMessage({
            type: 'encode',
            buffer: data
        });
    },
    decode: function(payload) {
        init_context();
        let buffer = new Uint8Array(payload);
        const data = decoder.decode(buffer);
        if (decoder.channels > 1) { // de-interleaved
          let pcmArray = [];
          for (let c = 0; c < decoder.channels; c++) {
            let pcm = new Float32Array(data.length / decoder.channels);
            for (let i = 0; i < data.length / decoder.channels; i++) {
              pcm[i] = data[i * decoder.channels + c];
            }
            pcmArray.push(pcm);
          }
          opus.postMessage({
            type: 'decode',
            buffer: pcmArray
          });
        } else {
          opus.postMessage({
            type: 'decode',
            buffer: [data]
          });
        }

    },
    mixBackground: function(url) {
      init_context();
      window.fetch(url)
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => context.decodeAudioData(arrayBuffer))
        .then(audioBuffer => {
          background = context.createBufferSource();
          background.buffer = audioBuffer;
          background.connect(context.destination);
          background.start();
        });
    },
    stopBackground: function() {
        if(background) {
          background.stop();
        }
    },
    play: function(pcmArray, time) {
        const aBuf = context.createBuffer(pcmArray.length, pcmArray[0].length, opus.sampleRate);
        for (let c = 0; c < pcmArray.length; c++) {
            aBuf.getChannelData(c).set(pcmArray[c]);
        }
        const aNode = context.createBufferSource();
        aNode.buffer = aBuf;
        aNode.connect(context.destination);

        const current_time = context.currentTime;
      if (context.state !== 'running') {
        context.resume();
      }
        if (current_time < time) {
            aNode.start(time);
            time += aNode.buffer.duration;
        } else {
            aNode.start(current_time);
            time = current_time + aNode.buffer.duration;
        }

        return {
            'time': time,
            'duration': aNode.buffer.duration
        };
    },
    getContext: function() {
      return context;
    }

}
