<template>
  <div class="full-page">
    <b-navbar toggleable="lg" type="dark" variant="info">
      <b-navbar-brand href="javascript:void(0);">Camera</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item-dropdown text="Channel" right>
            <b-dropdown-item href="javascript:void(0);"  @click="channelStart()">Start</b-dropdown-item>
            <b-dropdown-item href="javascript:void(0);"  @click="channelStop()">Stop</b-dropdown-item>
            <b-dropdown-item href="javascript:void(0);"  @click="channelClose()">Close</b-dropdown-item>
          </b-nav-item-dropdown>
          <b-nav-item href="javascript:void(0);" class="d-none">Audio</b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->

      </b-collapse>
    </b-navbar>

    <div class="canvas-container">
      <canvas id="_canvas" ref="canvas"></canvas><br>
    </div>


    <video id="_video" ref="video" muted hidden></video><br>
    <audio id="_audio" ref="audio" hidden></audio>
  </div>
</template>

<script>
    import Vue from 'vue';
    import {getCookie} from "../../util/support";
    import Audio from '../../util/audio';
    import Video from '../../util/video';
    import {
        API_BASE,
        KEY_CAMERA_ID, KEY_CAMERA_PORT, KEY_CAMERA_MOBILE,
        KEY_MANAGE_CAMERA,
        KEY_MANAGE_ID,
        KEY_MANAGE_NAME,
        LIVE_BASE
    } from "../../config/constants";
    import Core from "../../util/core";
    export default Vue.extend({
        data() {
            return {
                port: null,
                mobile: null,
                cameraIndex: 0,
                ws0: null,
                ws1: null,
                videoSize: {w: 640, h: 480},
                FPS: 20,
                QUALITY: 0.5,
                SAMPLE_RATE: 48000,
                BIT_RATE: 64000,
                STEREO: true,
                mjpeg: null,
                opus: null,
                aGainNode: null,
                audioIndex: 0,
                videoIndex: 0,
                videoPaused: true,
                grabIntervalId: null
            };
        },

        created() {
            this.mobile = getCookie(KEY_CAMERA_MOBILE);
            this.port = getCookie(KEY_CAMERA_PORT);
            this.ws0 = Core.worker();
            this.ws1 = Core.worker();
            this.mjpeg = Video.worker();
            this.opus = Audio.encoder(this.SAMPLE_RATE, this.STEREO, this.BIT_RATE);
            Core.init(this.ws0, this.ws1);
            Core.connect(LIVE_BASE);
            this.receiveMain();
            this.receiveClient();
            this.receiveOpus();
            this.receiveMjpeg();
            if (navigator.mediaDevices.getUserMedia === undefined) {
                navigator.mediaDevices.getUserMedia = function (constraints) {
                    var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
                    if (!getUserMedia) {
                        return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
                    }
                    return new Promise(function (resolve, reject) {
                        getUserMedia.call(navigator, constraints, resolve, reject);
                    });
                }
            }

        },

        methods: {
            channelOpen(){

                if (this.ws1.threadId) {
                    //Core.show_alert(_alert, 'warning', 'Already opened.');
                } else {
                    Core.channel_list();
                }
            },
            channelStart() {
                console.log("Click start channel");
                console.log(this.ws1.threadId);
                if (this.ws1.threadId === undefined) {
                    //Core.show_alert(_alert, 'warning', 'Not opened.');
                    return;
                }
                if (!this.videoPaused) {
                    //Core.show_alert(_alert, 'warning', 'Not stopped.');
                    return;
                }
                console.info("channel_start");
                let ref = this;
                //Core.show_alert(_alert, 'info', 'channel start');
                //
                navigator.mediaDevices.getUserMedia({
                    audio: {
                        sampleRate: this.SAMPLE_RATE,
                        echoCancellation: true,
                        echoCancellationType: 'system',
                        noiseSuppression: true,
                        latency: 0
                    },
                    video: {
                        width: (window.innerWidth > window.innerHeight ? this.videoSize.w : this.videoSize.h),
                        height: (window.innerWidth > window.innerHeight ? this.videoSize.h : this.videoSize.w),
                        facingMode: 'user'
                    }
                })
                    .then(function(stream) {
                        const aRecorder = Audio.recorder(stream);
                        // gain node
                        ref.aGainNode = Audio.getContext().createGain();
                        ref.aGainNode.gain.value = 0;
                        aRecorder.connect(ref.aGainNode);
                        aRecorder.onaudioprocess = ref.audioProcess;

                        // start
                        ref.videoPaused = false;
                        let _video = ref.$refs["video"];
                        _video.srcObject = stream;
                        _video.play();
                        ref.aGainNode.connect(Audio.getContext().destination);
                        //
                        ref.grabIntervalId = setInterval(ref.grab, 1000.0 / ref.FPS);

                        //
                        //Core.channel_start();
                    })
                    .catch(function(err) {
                        console.error("getUserMedia", err);
                    });
            },
            showChannelList(list) {
                console.log(list);
                list.forEach(e => {
                    let mobiles = JSON.parse(e.mobiles);
                    console.log(mobiles.length);
                    console.log(this.mobiles);
                    console.log(e.port);
                    console.log(this.port);
                    console.log(this.mobile);

                    if(e.port == this.port) {
                        for(var i = 0; i < mobiles.length; i ++) {
                            if(mobiles[i] == this.mobile) {
                                this.ws1.threadId = e.threadId;
                                console.log("Connected");
                                //Core.show_alert(_alert, 'info', 'connected');
                                Core.channel_connect(e);
                                this.cameraIndex = i + 1;
                                console.log(this.cameraIndex);

                                this.videoIndex = e.video;
                                this.audioIndex = e.audio;
                                return;
                            }
                        }
                    }
                });
            },

            receiveMain() {
                let ref = this;
                this.ws0.onmessage = e => {
                    switch (e.data.type) {
                        case 'connect':
                            if (e.data.result == 'close') {
                                //Core.show_alert(_alert, 'danger', 'main closed');
                            } else if (e.data.result == 'error') {
                                //Core.show_alert(_alert, 'danger', e.data.error);
                            } else {
                                ref.channelOpen();
                            }
                            break;
                        case 'config':
                            Core.config(e.data.config);
                            break;
                        case 'opened':
                            console.info('opened', e.data.info.threadId);
                            this.ws1.threadId = e.data.info.threadId;
                            Core.channel_connect(e.data.info);
                            //Core.show_alert(_alert, 'info', 'connect to ' + e.data.info.origin);
                            break;
                        case 'closed':
                            console.info('closed', e.data.info.threadId);
                            //Core.show_alert(_alert, 'info', 'closed');
                            delete this.ws1.threadId;
                            break;
                        case 'list':
                            ref.showChannelList(e.data.channel);
                            break;
                        case 'setting':
                            //Core.show_alert(_alert, 'info', "Change Setting changed");
                            ref.videoIndex = e.data.video;
                            ref.audioIndex = e.data.audio;
                            break;
                        default:
                            console.error("ws0 unkown msg:", e.data);
                    }
                }
            },
            receiveClient() {
                let ref = this;
                this.ws1.onmessage = e => {
                    switch (e.data.type) {
                        case 'connect':
                            console.log("Connected recived");
                            if (e.data.result == 'close') {
                                //Core.show_alert(_alert, 'info', 'channel closed');
                                //if (!_video.paused) channel_stop();
                                //delete ws1.threadId;
                            } else if (e.data.result == 'error') {
                                //Core.show_alert(_alert, 'danger', e.data.error);
                            }
                            break;
                        case 'open':
                            console.log('ws1 opened');
                            ref.channelStart();
                            break;
                        default:
                            console.error("unkown msg:", e.data);
                    }
                }
            },
            receiveOpus() {
                let ref = this;
                this.opus.onmessage = e => {
                    switch (e.data.type) {
                        case 'ready':
                            break;
                        case 'data':
                            Core.audio_data(ref.cameraIndex, e.data.payload, ref.ws1.threadId);
                            Core.channel_active(ref.cameraIndex, ref.ws1.threadId);
                            break;
                        case 'error':
                            console.error(e.data.error);
                            break;
                        default:
                            console.warn('audio', e.data);
                    }
                }
            },
            receiveMjpeg() {
                let ref = this;
                this.mjpeg.onmessage = e => {
                    switch (e.data.type) {
                        case 'data':
                            Core.video_data(ref.cameraIndex, e.data.payload, ref.ws1.threadId);
                            Core.channel_active(ref.cameraIndex, ref.ws1.threadId);
                            break;
                    }
                }
            },
            audioProcess(e) {
                Video.encode(this.FPS);
                Audio.encode(e.inputBuffer);
            },
            grab() {
                let _canvas = this.$refs["canvas"];
                let _video = this.$refs["video"];
                let window_height = window.innerHeight - 32;
                let window_width = window.innerWidth - 32;
                let scale_x = window_width / this.videoSize.w;
                let scale_y = window_height / this.videoSize.h;
                let scale = scale_x;
                if(scale_x > scale_y) {
                    scale = scale_y;
                }
                if(scale > 1) {
                    scale = 1;
                }
                _canvas.width = this.videoSize.w * scale;
                _canvas.height = this.videoSize.h * scale;
                const canvasCtx = _canvas.getContext('2d');
                canvasCtx.drawImage(_video, 0, 0, this.videoSize.w * scale, this.videoSize.h * scale);
                //
                //todo: another image processes
                //
                Video.frame(_canvas, this.QUALITY);
            },
            channelStop() {
                if (this.ws1.threadId === undefined) {
                    //Core.show_alert(_alert, 'warning', 'Not opened.');
                } else if (this.videoPaused) {
                    //Core.show_alert(_alert, 'warning', 'Not started.');
                } else {
                    console.info("channel_stop");
                    //Core.show_alert(_alert, 'info', 'channel stop');
                    this.videoPaused = true;
                    let _video = this.$refs["video"];
                    _video.pause();
                    this.aGainNode.disconnect(Audio.getContext().destination);
                    clearInterval(this.grabIntervalId);
                    // stop
                    //Core.channel_stop();
                }
            },
            channelClose() {
                if (this.ws1.threadId === undefined) {
                    //Core.show_alert(_alert, 'warning', 'Not opened.');
                } else if (!this.videoPaused) {
                    //Core.show_alert(_alert, 'warning', 'Not stopped.');
                } else {
                    Core.channel_disconnect();
                }
            }
        },
    });
</script>

<style scoped>
  .canvas-container {
    padding: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
