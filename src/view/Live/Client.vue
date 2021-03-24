<template>
  <div class="full-page">
    <b-navbar toggleable="lg" type="dark" variant="info">
      <b-navbar-brand href="javascript:void(0);">Live</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item-dropdown text="Channel" right v-if="passPassword && show_status">
            <b-dropdown-item href="javascript:void(0);"  @click="channelStart()">Start</b-dropdown-item>
            <b-dropdown-item href="javascript:void(0);"  @click="channelStop()">Stop</b-dropdown-item>
            <b-dropdown-item href="javascript:void(0);"  @click="channelClose()">Close</b-dropdown-item>
          </b-nav-item-dropdown>
          <b-nav-item-dropdown href="javascript:void(0);" text="Audio" right>
            <b-dropdown-item href="javascript:void(0);" >
              <form class="dropdown-item">
                Music
                <input type="range" class="form-control-range" min="0" max="100" value="100" v-model="musicVolume" @change="music_volume_change()">
              </form>
            </b-dropdown-item>
          </b-nav-item-dropdown>
          <b-nav-item-dropdown href="javascript:void(0);" text="Anim" right>
            <b-dropdown-item href="javascript:void(0);" >
              <form class="dropdown-item">
                Animation Size Change
                <input type="range" class="form-control-range" min="0" max="100" value="100" v-model="animationSize" @change="animation_size_change()">
              </form>
            </b-dropdown-item>
          </b-nav-item-dropdown>

          <b-nav-item href="javascript:void(0);" v-b-toggle.sidebar>Message</b-nav-item>
          <b-nav-item href="javascript:void(0);" @click="rotate()">Rotate</b-nav-item>
          <b-nav-item href="javascript:void(0);" @click="showPassword()" v-if="!passPassword">Password</b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->

      </b-collapse>
    </b-navbar>


    <div class="live-container d-flex normal" ref="live-container">
      <vue-draggable-resizable :min-width="360" :min-height="100" :w="videoContainerWidth" :h="videoContainerHeight" class="half-size"
                                :handles="[direction]" :draggable="false" :parent="true" @resizing="(left, top, width,height) => onResizing( idx, width,height )">
        <div class="child-align-center w-100 h-100" v-show="public_status == true && imgList != null && imgList.length>0" ref="image-container" v-on:resize="modifyImageSize()">
          <div class="w-100 mx-h-100">
            <VueSlickCarousel v-bind="settings">
              <div v-for="element in imgList" :key="element.id" class="text-center d-flex flex-column align-items-center justify-content-center" :style="imageStyles">
                <img :src="element.img" alt="画像はありません" v-bind:class="{
                  'width-auto': imageBasic == 1,
                  'height-auto': imageBasic != 1}" >
                <h6 class="text-center">{{element.title?element.title:''}}</h6>
              </div>
            </VueSlickCarousel>
          </div>

        </div>

        <div class="h-100" v-show="public_status == false">
          <div class="h-100 bg-dark d-flex justify-content-center align-items-center" >

            <div class="text-align-center">
              <h3>アルバムがありません。</h3>
              <button class="btn-danger">非公開中</button>
            </div>


          </div>
        </div>

      </vue-draggable-resizable>


      <div class="divide-line"></div>

      <div class="flex-1">

        <div class="w-100 h-100 child-align-center" ref="video-container">
          <div class="position-relative canvas-container" v-show="show_status == true">
            <canvas id="_canvas" ref="canvas" :hidden="showDefault"></canvas><br>
            <div class="position-absolute align-items-center" style="left: 0; top: 0; right: 0; bottom: 0" id="_default_video_parent" :hidden="!showDefault">
              <video id="_default_video" ref="default" type="video/mp4" autoplay loop playsinline></video><br>
            </div>
            <audio id="_background" ref="background" hidden></audio><br>
          </div>
        </div>


        <div class="h-100" v-show="show_status == false">
          <div class="h-100 bg-dark d-flex justify-content-center align-items-center" >

            <div class="text-align-center">
              <h3>配信中止中です。</h3>
              <button class="btn-danger">非公開中</button>
            </div>


          </div>
        </div>


      </div>
    </div>


    <b-modal ref="password-modal" hide-footer title="Live Password" >
      <div class="form-group d-flex-1 align-items-center">
        <label for="mobile1">パスワード</label>
        <input type="text" class="ml-3-1 form-control" id="mobile1" v-model="password">
        <p class="invalid" v-if="invalid_password">Invalid Password</p>
      </div>
      <b-button class="mt-2"  @click="checkPassword()">Submit</b-button>
    </b-modal>

    <b-sidebar
      id="sidebar"
      title="Message"
      backdrop
      shadow
    >
      <div class="px-3 py-2">
        <div class="custom-control custom-switch custom-control-inline">
          <input type="checkbox" class="custom-control-input" id="_txt_speech" v-model="speech">
          <label class="custom-control-label" for="_txt_speech">Speech</label>
        </div>
        <div class="custom-control custom-radio custom-control-inline">
          <input type="radio" class="custom-control-input" id="_txt_gender_male" name="_txt_gender" value="MALE" checked v-model="gender">
          <label class="custom-control-label" for="_txt_gender_male">Male</label>
        </div>
        <div class="custom-control custom-radio custom-control-inline">
          <input type="radio" class="custom-control-input" id="_txt_gender_famale" name="_txt_gender" value="FEMALE" v-model="gender">
          <label class="custom-control-label" for="_txt_gender_famale">Female</label>
        </div>
        <div class="card card-body">

          <select class="form-control" id="_txt_language" ref="language" v-model="language">
            <option v-for="item in languageList" :key="item.code" :value="item.code">{{item.name}}</option>
          </select>
          <input class="form-control mt-2" type="text" placeholder="your name" v-model="name">
          <textarea class="form-control mt-2" placeholder="message" v-model="text"></textarea>
          <button type="submit" class="btn btn-primary mt-2" :disabled="isBlock" @click="text_submit()">Submit</button>
          <div id="_txt_alert"></div>
        </div>
        <div class="card card-body mt-2" id="_txt_msg">
          <div v-for="(message) in messages"  class="d-flex align-items-center" :key="message.time">
            <div class='flex-fill'>
              <font color="message.color">{{message.time + " " + message.user.name }} <br> {{message.message}}</font>
              <br><font color='gray' v-if="message.original">{{"(" + message.language + ") " + message.original}}</font>
            </div>
          </div>
        </div>
      </div>
    </b-sidebar>
  </div>
</template>

<script>
    import Vue from 'vue';
    import {getCookie} from "../../util/support";
    import Audio from '../../util/audio';
    import Video from '../../util/video';
    import Anim from '../../util/anim';
    import VueSlickCarousel from 'vue-slick-carousel'
    import 'vue-slick-carousel/dist/vue-slick-carousel.css'

    import {
        API_BASE, ADMIN_BASE,
        KEY_CAMERA_ID, KEY_CAMERA_PORT,
        KEY_MANAGE_CAMERA,
        KEY_MANAGE_ID,
        KEY_MANAGE_NAME, KEY_USER_MOBILE,
        LIVE_BASE
    } from "../../config/constants";
    import Core from "../../util/core";

    export default Vue.extend({
        components: {
            VueSlickCarousel
        },
        data() {
            return {
                public_status: false,
                show_status: false,
                id: null,
                ws0: null,
                ws1: null,
                SAMPLE_RATE: 48000,
                limit: 8,
                STEREO: true,
                mjpeg: null,
                opus: null,
                playing: false,
                audioBuffer: [],
                scheduled_time: 0,
                isBlock: false,
                mobile: null,
                showDefault: false,
                speech: true,
                name: null,
                text: null,
                language: null,
                gender: null,
                musicVolume: 100,
                animationSize: 100,
                messages: [],
                languageList: [],
                locale: null,
                startTime: null,
                sumDuration: 0,
                imgList: [],
                timerInterval: null,
                videoSize: {
                    w: 640,
                    h: 480
                },

                settings: {
                    arrows: false,
                    dots: false,
                    autoplay: true,
                    autoplaySpeed: 3000
                },
                connection: null,
                last_show_status: false,
                live_status: null,
                live_password: null,
                password: null,
                invalid_password: false,
                direction: 'bm',
                videoContainerWidth: 0,
                videoContainerHeight: 0,
                lastImage: null,
                passPassword: false,
                imageBasic: 1,
                imageWidth: 0,
                imageHeight: 0,
                video_index: 0,
                audio_index: 0
            };
        },

        created() {



            this.socketConnection();

            this.id = this.$route.params.id;
            this.mobile = getCookie(KEY_USER_MOBILE + this.id);

            this.ws0 = Core.worker();
            this.ws1 = Core.worker();
            this.mjpeg = Video.worker();
            this.opus = Audio.decoder(this.SAMPLE_RATE, this.STEREO);
            Core.init(this.ws0, this.ws1);
            Core.connect(LIVE_BASE);
            this.receiveMain();
            this.receiveClient();
            this.receiveOpus();
            this.receiveMjpeg();

        },
        mounted() {
            this.initVideoContainerSize();
        },

        methods: {
            socketConnection() {
                this.connection = new WebSocket(API_BASE);
                let ref = this;
                this.connection.onmessage = function(event) {
                    //this.isLoading = false;
                    let data = JSON.parse(event.data);
                    if(data.path == 'get_password_status') {
                        let json = data.content;
                        ref.live_status = json.live_status;
                        ref.live_password = json.live_password;
                        if(ref.live_password == '') {
                            ref.passPassword = true;
                        } else {

                        }
                        ref.getStatus();
                        ref.timerInterval = setInterval(() => (ref.getStatus()), 1000 * 10);
                        ref.initVideoContainerSize();
                    } else {
                        if(data.status == true) {
                            let json = data.content;
                            ref.show_status = json.show_status;
                            ref.public_status = json.public_status;
                            ref.settings.autoplaySpeed = parseInt(json.slide_speed) * 1000;
                            ref.imgList = json.imgList;
                            for(var i = 0; i < json.imgList.length; i ++) {
                                ref.imgList[i].img = ADMIN_BASE + '/' + json.imgList[i].img;
                            }
                            if(ref.last_show_status != ref.show_status) {
                                if(ref.show_status) {
                                    ref.channelStart();
                                } else {
                                    ref.channelStop();
                                }
                                ref.last_show_status = ref.show_status;
                            }

                        }
                    }

                };
                this.connection.onopen = function(event) {
                    if(ref.timerInterval == null) {
                        ref.getPasswordStatus();
                    }

                };

                this.connection.onclose = function(e) {
                    setTimeout(function() {
                        ref.socketConnection()
                    }, 1000);
                };

                this.connection.onerror = function(err) {
                    ref.connection.close();
                };
            },
            showPassword() {
                this.$refs['password-modal'].show();
            },
            checkPassword() {
                if(this.password == this.live_password) {
                    this.$refs['password-modal'].hide();
                    if(this.show_status == true) {
                        this.channelStart();
                    }
                    this.passPassword = true;
                } else {
                    this.invalid_password = true;
                }
            },
            startLive() {
                this.channelStart();
            },
            getPasswordStatus() {
                this.connection.send(JSON.stringify({
                    type: 'api',
                    method: 'channel',
                    path: 'get_password_status',
                    body: {
                        id: this.id
                    }
                }));
            },
            getStatus() {
                this.connection.send(JSON.stringify({
                    type: 'api',
                    method: 'channel',
                    path: 'get_status',
                    body: {
                        id: this.id
                    }
                }));
            },
            onEnded() {
                this.playing = false;
                if(this.audioBuffer.length > 0) {
                    let data = this.audioBuffer[0];
                    this.audioBuffer.shift();
                    this.play(data);
                }
            },
            play(data) {
                if(this.startTime == null) {
                    this.startTime = (new Date()).getTime();
                }
                this.playing = true;
                if(this.video_index == this.audio_index) {
                    Video.play();
                }

                let result = Audio.play(data, this.scheduled_time);
                this.scheduled_time = result.time;
                let duration = result.duration;
                this.sumDuration = this.sumDuration + duration;
                Core.send_log("result is " + JSON.stringify(result));
                setTimeout(this.onEnded, duration * 1000);
                let time = (new Date()).getTime();
            },
            channelOpen(){
                if (this.ws1.threadId) {
                    //Core.show_alert(_alert, 'warning', 'Already opened.');
                } else {
                    Core.channel_list();
                }
            },
            channelStart() {
                if (this.ws1.threadId === undefined) {
                    //Core.show_alert(_alert, 'warning', 'Not opened.');
                } else if (this.ws1.playing) {
                    //Core.show_alert(_alert, 'warning', 'Now playing.');
                } else {
                    console.info('channel_start');
                    Core.fetch_start(this.ws1.threadId);
                }
            },
            showChannelList(list) {
                list.forEach(e => {
                    if(e.id == this.id) {
                        this.ws1.threadId = e.threadId;
                        const origin = e.origin;
                        console.log("Connect");
                        //Core.show_alert(_alert, 'info', 'connected ');
                        Core.channel_connect(e);
                        return ;
                    }
                });
            },

            receiveMain() {
                let ref = this;
                this.ws0.onmessage = e => {
                    switch (e.data.type) {
                        case 'connect':
                            console.log("Connected " + e.data.result);
                            if (e.data.result == 'close') {
                                //Core.show_alert(_alert, 'danger', 'main closed');
                            } else if (e.data.result == 'error') {
                                //Core.show_alert(_alert, 'danger', e.data.error);
                            } else if(e.data.result == 'open') {
                                ref.channelOpen();
                            }
                            break;
                        case 'config':
                            Core.config(e.data.config);
                            Core.text_languages(); // must be call after config
                            break;
                        case 'languages':
                            Core.text_language_list(e.data);
                            //Ui.restore(); // restore from cookie
                            break;
                        case 'list':
                            ref.showChannelList(e.data.channel);
                            break;
                        case 'start':
                            console.log("Initial audio is " + e.data.audio);
                            if(e.data.audio) {
                                console.log("Mix background");
                                let _background = ref.$refs["background"];
                                _background.src = e.data.audio;
                                Audio.stopBackground();
                                Audio.mixBackground(_background.src);
                                //_background.play();
                            }
                            console.log(e.data);
                            if(e.data.anim) {
                                ref.anim_play(e.data.anim);
                            }
                            //init();
                            let index = parseInt(e.data.video);
                            if(isNaN(index)) {
                                console.log("Show Video");
                                ref.showVideo(e.data.video);
                            }
                            ref.video_index = e.data.video_index;
                            ref.audio_index = e.data.audio_index;
                            Core.fetch_start_sub(e.data.threadId, e.data.channel);
                            break;

                        case 'fetch':
                            Core.fetch_next(e.data.channel);
                            break;
                        case 'music':
                            let _background = ref.$refs["background"];
                            console.log(e.data);
                            if (e.data.src) {
                                _background.src = e.data.src;
                                Audio.stopBackground();
                                Audio.mixBackground(_background.src);
                                //_background.play();
                            } else {
                                Audio.stopBackground();
                                //_background.pause();
                            }
                            break;
                        case 'anim':
                            ref.anim_play(e.data.anim);
                            break;
                        case 'setting':
                            let video_index = parseInt(e.data.video);
                            if(isNaN(video_index)) {
                                ref.showVideo(e.data.video);
                            } else {
                                ref.stopVideo();
                            }
                            ref.video_index = e.data.video;
                            ref.audio_index = e.data.audio;
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
                            if (e.data.result == 'close') {
                                delete ref.ws1.threadId;
                                delete ref.ws1.playing;
                                //Core.show_alert(_alert, 'info', 'channel closed');
                            } else if (e.data.result == 'error') {
                                //Core.show_alert(_alert, 'danger', e.data.error);
                            } else {
                                if(ref.passPassword == true && ref.show_status == true) {
                                    ref.channelStart();
                                }

                            }
                            break;
                        case 'open':
                            //Core.show_alert(_alert, 'info', 'opened');
                            break;
                        case 'video':
                            //console.log("Recevie video data " + e.data.payload.length);
                            Video.decode(e.data.payload);
                            break;
                        case 'audio':
                            //console.log("Recevie audio data " + e.data.payload.byteLength);
                            Audio.decode(e.data.payload);
                            break;
                        case 'text':
                            Core.text_translate(e.data, this.language);
                            break;
                        case 'text_remove':
                            Core.text_remove_message(e.data);
                            ref.setBlock(e.data);
                            break;
                        case 'translated':
                            Core.text_append(e.data.payload, ref.speech);
                            break;
                        case 'tts':
                            Core.text_speech(e.data.payload);
                            break;
                        case 'fetch':
                            switch (e.data.method) {
                                case 'start':
                                    ref.ws1.playing = true;
                                    //Core.show_alert(_alert, 'info', 'fetch start');
                                    break;
                                case 'stop':
                                    delete ref.ws1.playing;
                                    //Core.show_alert(_alert, 'info', 'fetch stop');
                                    break;
                                case 'none':
                                    //Core.show_alert(_alert, 'info', 'no data');
                                    break;
                            }
                            break;
                        case 'debug':
                            //Core.show_alert(_alert, 'info', e.data.text);
                            break;
                        case 'message':
                            let json = {};
                            switch (e.data.method) {
                                case 'clear':
                                    this.messages = [];
                                    break;
                                case 'remove':
                                    console.log(e.data);
                                    for(var i = this.messages.length - 1; i >= 0 ; i --) {
                                        if(this.messages[i].user.mobile == e.data.content.mobile) {
                                            this.messages.splice(i, 1);
                                        }
                                    }
                                    break;
                                case 'speech':
                                    if(e.data.payload) {
                                        const audio = document.createElement("audio");
                                        audio.src = e.data.payload; // data type + base64
                                        audio.play();
                                    }
                                    break;
                                case 'languages':
                                    json = e.data.content;
                                    this.language = json.locale;
                                    this.languageList = json.languages;
                                    break;
                                case 'add':
                                    json = e.data.content;
                                    const date = new Date(json.utc);
                                    const timeStr = "[" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "]";
                                    json.time = timeStr;
                                    this.messages.push(json);
                                    if(this.messages.length > 300) {
                                        this.messages.shift();
                                    }
                                    break;
                            }
                            break;
                        default:
                            console.error("ws1 unkown msg:", e.data);
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
                            if(ref.playing == false) {
                                ref.play(e.data.payload);
                            } else {
                                if(ref.audioBuffer.length >= ref.limit) {
                                    ref.audioBuffer.shift();
                                }
                                ref.audioBuffer.push(e.data.payload);
                            }
                            break;
                        case 'error':
                            console.error('audio decode error', e.data.error);
                        default:
                    }
                }
            },
            receiveMjpeg() {
                let ref = this;
                this.mjpeg.onmessage = e => {
                    switch (e.data.type) {
                        case 'frame':
                            //Core.send_log('Receive frames');
                            var img = new Image();
                            img.onload = function() {
                                ref.lastImage = img;
                                ref.modifyCanvasSize();
                            }
                            img.src = URL.createObjectURL(e.data.blob);
                            break;
                        case 'data':
                            if(ref.video_index != ref.audio_index) {
                                Video.play();
                            }
                            break;

                    }
                }
            },
            setBlock(json) {
                if(json.mobile == this.mobile) {
                    this.isBlock = true;
                }
            },
            showVideo(src) {
                console.log(src);
                this.showDefault = true;

                let _default = this.$refs["default"];
                _default.src = LIVE_BASE + "/" + src;
                _default.play();
            },
            stopVideo() {
                let _default = this.$refs["default"];
                _default.pause();
                this.showDefault = false;
            },

            channelStop() {
                if (this.ws1.threadId === undefined) {
                    //Core.show_alert(_alert, 'warning', 'Not opened.');
                } else if (this.ws1.playing === undefined) {
                    //Core.show_alert(_alert, 'warning', 'Not played.');
                } else {
                    console.info('channel_stop');
                    Core.fetch_stop();
                    delete this.ws1.playing;
                }
                let _default = this.$refs["default"];
                let _audio = this.$refs["audio"];
                let _background = this.$refs["background"];
                if (!_audio.paused) {
                    _audio.pause();
                }
                if (!_background.paused) {
                    _background.pause();
                }
                if (!_default.paused) {
                    _default.pause();
                }
            },
            channelClose() {
                if (this.ws1.threadId === undefined) {
                    //Core.show_alert(_alert, 'warning', 'Not opened.');
                } else {
                    console.info('channel_close');
                    //Core.show_alert(_alert, 'info', 'channel close');
                    Core.channel_disconnect();
                    Core.text_clear();
                }
            },
            text_submit() {
                if (this.ws1.threadId === undefined) {
                    //Core.show_alert(_alert, 'warning', 'Not opened.');
                } else {
                    const name = this.name;
                    const user = {
                        name: name,
                        mobile: this.mobile
                    };
                    const message = this.text;
                    const locale = this.language;
                    // todo: set color
                    const colors = ['black', 'midnightblue', 'darkslategray', 'maroon', 'darkred'];
                    if (user && message) {
                        const color = colors[user.length % colors.length];
                        Core.text_submit({
                            user: user,
                            message: message,
                            color: color,
                            language: locale,
                            gender: this.gender,
                            threadId: this.ws1.threadId
                        });
                    } else {
                        //Core.show_alert(_txt_alert, 'danger', 'Fill in your name and message');
                    }
                }
            },
            music_volume_change() {
                let _default = this.$refs["default"];
                let _audio = this.$refs["audio"];
                let _background = this.$refs["background"];
                _audio.volume = this.musicVolume / 100;
                _background.volume = this.musicVolume / 100;
                _default.volume = this.musicVolume / 100;
            },
            animation_size_change() {
              Anim.setScale(this.animationSize / 100);
            },
            music_stop() {
                let _audio = this.$refs["audio"];
                _audio.pause();
            },

            anim_play(anim) {
                if (anim.src) {
                    const loop = anim.loop;
                    const speed = anim.speed;
                    const src = LIVE_BASE + "/" + anim.src;
                    //console.log(_anim.selectedIndex, loop, speed);
                    Anim.play(src, loop, speed)
                        .then(() => {
                            // for debug
                            // if (!this.showDefault) {
                            //     let _canvas = this.$refs["canvas"];
                            //     _canvas.width = this.videoSize.w;
                            //     _canvas.height = this.videoSize.h;
                            //     const canvasCtx = _canvas.getContext('2d');
                            //     Anim.start(canvasCtx);
                            //     //Anim.opacity(0.3);
                            // }
                        })
                        .catch((e) => {
                            console.error(e);
                        });
                } else {
                    Anim.stop();
                }
            },

            rotate() {
                let liveContainer = this.$refs["live-container"];
                if(liveContainer.classList.contains('rotate')){
                    liveContainer.classList.remove('rotate');
                    liveContainer.classList.add('normal');
                    this.direction = 'bm';
                } else {
                    liveContainer.classList.add('rotate');
                    liveContainer.classList.remove('normal');
                    this.direction = 'mr';
                }
                this.initVideoContainerSize();
            },
            onResizing( id, width, height) {
                console.log("Change size is " + width + ":"+ height);
                this.videoContainerWidth = width;
                this.videoContainerHeight = height;
                this.modifyCanvasSize();
                let containerWidth = this.$refs["image-container"].offsetWidth;
                let containerHeight = this.$refs["image-container"].offsetHeight;
                this.modifyImageSize(containerWidth, containerHeight);
            },
            initVideoContainerSize() {
                this.videoContainerWidth = this.$refs["live-container"].offsetWidth / 2;
                this.videoContainerHeight = this.$refs["live-container"].offsetHeight / 2;
                this.modifyCanvasSize();
                if(this.direction == 'mr') {
                    this.modifyImageSize(this.videoContainerWidth, this.videoContainerHeight * 2);
                } else {
                    this.modifyImageSize(this.videoContainerWidth * 2, this.videoContainerHeight);
                }
            },
            modifyImageSize(containerWidth, containerHeight) {

                console.log("Change size is " + containerWidth + ":"+ containerHeight);
                if(containerHeight * 4 > containerWidth * 3) {
                    this.imageBasic = 1;
                    this.imageHeight = containerWidth * 3 / 4 - 24;
                }  else {
                    this.imageBasic = 0;
                    this.imageHeight = containerHeight - 24;
                }
            },
            modifyCanvasSize() {
                if(this.lastImage) {
                    var ref = this;
                    let _canvas = ref.$refs["canvas"];
                    let window_height = ref.$refs["video-container"].offsetHeight - 32;
                    let window_width = ref.$refs["video-container"].offsetWidth - 32;

                    let scale_x = window_width / ref.lastImage.width;
                    let scale_y = window_height /ref.lastImage.height;
                    let scale = scale_x;
                    if(scale_x > scale_y) {
                        scale = scale_y;
                    }

                    _canvas.width = ref.lastImage.width * scale;
                    _canvas.height = ref.lastImage.height * scale;
                    const canvasCtx = _canvas.getContext('2d');
                    canvasCtx.drawImage(ref.lastImage, 0, 0, ref.lastImage.width * scale, ref.lastImage.height * scale);
                    if (Anim.hasPlaying()) Anim.draw(canvasCtx);
                }

            }
        },

        computed: {
            imageStyles () {
                return {
                    height: `${this.imageHeight}px`,
                }
            }
        }


    });
</script>

<style scoped>
#_default_video {
  width: 100%;
}

.live-container {
  height: calc(100% - 56px);
}

.live-container.d-flex {
  flex-direction: column;
}

.live-container.rotate.d-flex {
  flex-direction: row;
}

  .normal .half-size {
    width: 100% !important;
    height: 50%;
    position: relative !important;
    margin-bottom: 16px;
  }

  .rotate .half-size {
    width: 50%;
    height: 100% !important;
    position: relative !important;
    margin-right: 16px;
  }

  .divide-line {
    width: 100%;
    height: 0px;
    background: white;
  }

  .rotate .divide-line {
    width: 2px;
    height: 100%;
    background: white;
  }

  .rotate {
    display: flex;
  }

  .canvas-container {
    padding: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  h3 {
    color: white;
  }

  .text-align-center {
    text-align: center;
  }

  .invalid {
    color: red;
  }

  .flex-1 {
    flex: 1;
    overflow: hidden;
  }

  .mx-h-100 {
    max-height: 100%;
  }

  img.width-auto{
    width: calc(100% - 32px);
    height: auto;
  }
  img.height-auto{
    width: auto;
    height: calc(100% - 24px);;
  }



  .slick-slider {
    height: 100%;
  }

  .slick-list {
    height: 100%;
  }



</style>
