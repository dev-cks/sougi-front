<template>
  <div class="full-page">
    <b-navbar toggleable="lg" type="dark" variant="info">
      <b-navbar-brand href="javascript:void(0);">Manage</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item-dropdown text="Channel" right>
            <b-dropdown-item href="javascript:void(0);" :hidden="isSetNumber" @click="showMobileModal()">Set Mobile Number</b-dropdown-item>
            <b-dropdown-item class="d-none" href="javascript:void(0);" :hidden="!isSetNumber && isOpen" @click="channelOpen()">Open</b-dropdown-item>
            <b-dropdown-item href="javascript:void(0);" :hidden="!isOpen" @click="channelActiveList()">Setting</b-dropdown-item>
            <b-dropdown-item href="javascript:void(0);" :hidden="!isOpen" @click="channelStop()">Stop</b-dropdown-item>
            <b-dropdown-item href="javascript:void(0);" :hidden="!isOpen" @click="channelClose()">Close</b-dropdown-item>
          </b-nav-item-dropdown>
          <b-nav-item href="javascript:void(0);" :hidden="!isOpen" @click="showAudioModal()">Audio</b-nav-item>
          <b-nav-item href="javascript:void(0);" :hidden="!isOpen" @click="showAnimModal()">Anim</b-nav-item>
          <b-nav-item href="javascript:void(0);" :hidden="!isOpen" v-b-toggle.sidebar>Message</b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->

      </b-collapse>
    </b-navbar>
    <b-sidebar
      id="sidebar"
      title="Message"
      backdrop
      shadow
    >
      <div class="px-3 py-2">


        <div class="card card-body mt-2" id="_txt_msg">
          <div v-for="message in messages"  class="d-flex align-items-center" :key="message.time">
            <div class='flex-fill'>
              <font color="message.color">{{message.time + " " + message.user.name }} <br> {{message.message}}</font>
              <br><font color='gray' v-if="message.original">{{"(" + message.language + ") " + message.original}}</font>
            </div>
            <button @click="textRemove(message.user.mobile)">BAN</button>
          </div>
        </div>
      </div>
    </b-sidebar>
    <b-modal ref="mobile-modal" hide-footer title="Set Mobile Number">
      <div class="form-group d-flex-1 align-items-center">
        <label for="mobile1">お電話番号1</label>
        <input type="number" class="ml-3-1 form-control" id="mobile1" v-model="mobile1">
        <label for="mobile2">お電話番号2</label>
        <input type="number" class="ml-3-1 form-control" id="mobile2" v-model="mobile2">
        <label for="mobile3">お電話番号3</label>
        <input type="number" class="ml-3-1 form-control" id="mobile3" v-model="mobile3">

      </div>
      <b-button class="mt-2"  @click="saveCamera()">Submit</b-button>
    </b-modal>

    <b-modal ref="audio-modal" hide-footer title="Set Audio">
    <div class="form-group d-flex-1 align-items-center">
      <select class="form-control" id="_music" v-model="audio">
        <option v-for="option in musicOptions" v-bind:value="option.value" :key="option.value">
          {{ option.text }}
        </option>
      </select>

    </div>
    <b-button class="mt-2"  @click="updateAudio()">Submit</b-button>
  </b-modal>

    <b-modal ref="anim-modal" hide-footer title="Set Audio">
      <div class="form-group d-flex-1 align-items-center">
        <select class="form-control" id="_anim" v-model="anim">
          <option value="-1" selected>stop</option>
          <option value="0" >anim.png (speed=2.0 loop=3)</option>
          <option value="1" >anim32.png (loop=0)</option>
          <option value="2">image.png (err)</option>
          <option value="3">anim0.webp</option>
          <option value="4">anim1.webp (loop=5 speed=2.5)</option>
          <option value="5">image.webp (err)</option>
        </select>
      </div>
      <b-button class="mt-2"  @click="updateAnim()">Submit</b-button>
    </b-modal>

    <b-modal ref="setting-modal" hide-footer title="Setting">
      <div class="form-group d-flex-1 align-items-center">
        <div >

          <label class="radio-inline">
            <input type="radio" name="video" checked value="1"  disabled v-model="videoIndex" v-if="cameraStatus[0] == false">
            <input type="radio" name="video" checked value="1"   v-model="videoIndex" v-else> Video1
          </label>
          <label class="radio-inline">
            <input type="radio" name="video"  value="2"  disabled v-model="videoIndex" v-if="!cameraStatus[1]">
            <input type="radio" name="video"  value="2"   v-model="videoIndex" v-else>
            Video 2
          </label>
          <label class="radio-inline">
            <input type="radio" name="video"  value="3"  disabled v-model="videoIndex" v-if="!cameraStatus[2]">
            <input type="radio" name="video"  value="3"   v-model="videoIndex" v-else>
            Video 3
          </label>
        </div>
        <div >
          <label class="radio-inline">
            <input type="radio" name="video" value="media/video_2.mp4" v-model="videoIndex">Default Video 1
          </label>
        </div>
        <div >
          <label class="radio-inline">
            <input type="radio" name="audio" checked value="1"  disabled v-model="audioIndex" v-if="!cameraStatus[0]">
            <input type="radio" name="audio" checked value="1"   v-model="audioIndex" v-else>
            Audio 1
          </label>
          <label class="radio-inline">
            <input type="radio" name="audio"  value="2"  disabled v-model="audioIndex" v-if="!cameraStatus[1]">
            <input type="radio" name="audio"  value="2"   v-model="audioIndex" v-else>Audio 2
          </label>
          <label class="radio-inline">
            <input type="radio" name="audio"  value="3"  disabled v-model="audioIndex" v-if="!cameraStatus[2]">
            <input type="radio" name="audio"  value="3"   v-model="audioIndex" v-else>Audio 3
          </label>
        </div>
      </div>
      <b-button class="mt-2"  @click="channelModify()">Modify</b-button>
    </b-modal>
  </div>

</template>

<script>
    import Vue from 'vue';
    import FastSound from 'fast-sound';
    import {getCookie} from "../../util/support";
    import {
        API_BASE,
        ADMIN_BASE,
        KEY_MANAGE_CAMERA,
        KEY_MANAGE_ID,
        KEY_MANAGE_MUSIC,
        KEY_MANAGE_NAME, KEY_MANAGE_ORIGINAL_MUSIC,
        LIVE_BASE
    } from "../../config/constants";
    import Core from "../../util/core";
    export default Vue.extend({

        data() {
            return {
                isSetNumber: false,
                isOpen: false,
                cameras: [],
                id: null,
                cameraStatus: [],
                name: null,
                mobile1: null,
                mobile2: null,
                mobile3: null,
                ws0: null,
                ws1: null,
                connection: null,
                loader: null,
                audioIndex: 1,
                videoIndex: 1,
                audio: null,
                anim: null,
                messages: [],
                language: null,
                musicOptions: [
                    { text: 'Stop', value: '' },
                    { text: 'At_The_Shore_The_Dark_Contenent', value: LIVE_BASE + '/media/At_The_Shore_The_Dark_Contenent.mp3' },
                    { text: 'Beach_Party_Islandesque', value: LIVE_BASE + '/media/Beach_Party_Islandesque.mp3' },
                    { text: 'For_Mimi', value: LIVE_BASE + '/media/For_Mimi.mp3' }
                ],
                masterMusic: null,
                originalMusic: null
            };
        },

        created() {
            this.cameraStatus = [true, true, true];
            this.cameras = getCookie(KEY_MANAGE_CAMERA);
            this.id = getCookie(KEY_MANAGE_ID);
            this.name = getCookie(KEY_MANAGE_NAME);
            this.masterMusic = getCookie(KEY_MANAGE_MUSIC);
            this.originalMusic = getCookie(KEY_MANAGE_ORIGINAL_MUSIC);
            if(this.masterMusic && this.masterMusic != '') {
                this.musicOptions.push({ text: this.originalMusic, value: ADMIN_BASE + '/' + this.masterMusic })
            }
            if(this.cameras.length == 0) {
                this.isSetNumber = false;
            } else {
                this.isSetNumber = true;
            }
            this.ws0 = Core.worker();
            this.ws1 = Core.worker();
            Core.init(this.ws0, this.ws1);
            Core.connect(LIVE_BASE);
            this.receiveMain();
            this.receiveClient();

            this.connection = new WebSocket(API_BASE);
            let ref = this;
            this.connection.onmessage = function(event) {
                ref.loader.hide();
                //this.isLoading = false;
                let data = JSON.parse(event.data);
                if(data.status == true) {
                    ref.cameras = data.content;
                    ref.isSetNumber = true;
                    ref.channelOpen();
                }

            };
        },

        methods: {
            createLoader() {
                this.loader = this.$loading.show({
                    // Optional parameters
                    container: null,
                    canCancel: true,
                });
            },
            showAudioModal() {
                this.$refs['audio-modal'].show();
            },
            showAnimModal() {
                this.$refs['anim-modal'].show();
            },
            updateAudio() {
                this.$refs['audio-modal'].hide();
                if (this.audio && this.audio.length > 0) {
                    Core.music(this.ws1.threadId, this.audio); // play
                } else {
                    Core.music(this.ws1.threadId); // stop
                }
            },
            updateAnim() {
                this.$refs['anim-modal'].hide();
                Core.anim(this.ws1.threadId, this.anim);
            },
            showMobileModal() {
                this.$refs['mobile-modal'].show();
            },
            showSettingModal(list) {
                console.log(list);
                console.log(list.length);
                for(var i = 1; i <= 3; i ++) {
                    let isActive = false;
                    list.forEach(index => {
                        if(index == i) {
                            isActive = true;
                        }
                    });

                    //this.cameraStatus[i - 1] = isActive;
                }
                this.$refs['setting-modal'].show();
            },
            saveCamera() {
                this.$refs['mobile-modal'].hide();
                let mobiles = [];
                let mobiles_pre = [this.mobile1, this.mobile2, this.mobile3];
                for(var i = 0; i < mobiles_pre.length; i ++) {
                    if(mobiles_pre[i] && mobiles_pre[i] != '') {
                        mobiles.push(mobiles_pre[i]);
                    }
                }

                let data = {
                    id: this.id,
                    camera: mobiles.join(',')
                };
                this.connection.send(JSON.stringify({
                    type: 'api',
                    method: 'channel',
                    path: 'update',
                    body: data
                }));
                this.createLoader();
            },
            textRemove(mobile) {
                Core.text_remove(mobile);
            },
            channelOpen() {
                if (this.ws1.threadId) {
                    //Core.show_alert(_alert, 'warning', 'Already opened.');
                } else {
                    Core.channel_open(this.id, this.name, this.cameras); //todo
                }
            },
            channelClose() {
                if (this.ws1.threadId === undefined) {
                    //Core.show_alert(_alert, 'warning', 'Not opened.');
                }  else {
                    Core.channel_close(this.ws1.threadId);
                }
            },
            channelStop() {
                if (this.ws1.threadId === undefined) {
                    //Core.show_alert(_alert, 'warning', 'Not opened.');
                } else {
                    console.info("channel_stop");
                    //Core.show_alert(_alert, 'info', 'channel stop');
                    // stop
                    Core.channel_stop();
                }
            },
            channelActiveList() {
                if (this.ws1.threadId) {
                    Core.channel_active_list(this.ws1.threadId);
                } else {
                    //Core.show_alert(_alert, 'warning', 'Not opened.');
                }
            },
            channelModify() {
                this.$refs['setting-modal'].hide();
                Core.channel_setting(this.videoIndex, this.audioIndex, this.ws1.threadId);
            },
            receiveMain() {
                let ref = this;
                this.ws0.onmessage = e => {
                    switch (e.data.type) {

                        case 'connect':
                            console.log("Connected");
                            if (e.data.result == 'close') {
                                //Core.show_alert(_alert, 'danger', 'main closed');
                            } else {
                                if(this.isSetNumber) {
                                    this.channelOpen();
                                }
                            }
                            break;
                        case 'config':
                            Core.config(e.data.config);
                            Core.text_languages(); // must be call after config
                            break;
                        case 'active_list':
                            ref.showSettingModal(e.data.list);
                            break;
                        case 'languages':
                            Core.text_language_list(e.data);
                            break;
                        case 'opened':
                            console.info('opened', e.data.info.threadId);
                            this.ws1.threadId = e.data.info.threadId;
                            //this.isSetNumber = true;
                            Core.channel_connect(e.data.info);
                            //Core.show_alert(_alert, 'info', 'connected');
                            break;
                        case 'created':
                            let port = e.data.info.port;

                        case 'closed':
                            console.info('closed', e.data.info.threadId);
                            //Core.show_alert(_alert, 'info', 'closed');
                            delete this.ws1.threadId;
                            break;
                        default:
                            console.error("ws0 unkown msg:", e.data);
                    }
                }
            },
            receiveClient() {
                this.ws1.onmessage = e => {
                    switch (e.data.type) {
                        case 'connect':
                            if (e.data.result == 'close') {
                                //Core.show_alert(_alert, 'info', 'channel closed');
                            }
                            break;
                        case 'open':
                            console.log('ws1 opened');
                            this.isOpen = true;
                            // do nothing
                            break;
                        case 'text':
                            e.data.sender = 1;
                            Core.text_translate(e.data, this.language, false);
                            break;
                        case 'text_remove':
                            Core.text_remove_message(e.data);
                            break;
                        case 'translated':
                            Core.text_append(e.data.payload);
                            break;
                        case 'tts':
                            Core.text_speech(e.data.payload);
                            break;
                        case 'transcription':
                            Core.text_submit({
                                user: '(Speech)' + (_txt_name.value || ""),
                                color: 'yellow',
                                gender: _txt_gender_male.checked ? 'MALE' : 'FEMALE',
                                language: e.data.locale,
                                message: e.data.text
                            });
                        case 'message':
                            console.log(this.messages);
                            console.log(e.data);
                            switch (e.data.method) {
                                case 'add':
                                  let json = e.data.content;
                                  const date = new Date(json.utc);
                                  const timeStr = "[" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "]";
                                  json.time = timeStr;
                                  this.messages.push(json);
                                  if(this.messages.length > 300) {
                                      this.messages.shift();
                                  }
                                  break;
                                case 'remove':
                                    for(var i = this.messages.length - 1; i >= 0 ; i --) {
                                        if(this.messages[i].user.mobile == e.data.content.mobile) {
                                            this.messages.splice(i, 1);
                                        }
                                    }
                                    break;
                                case 'languages':
                                    json = e.data.content;
                                    this.language = json.locale;
                                    break;
                            }
                            break;
                        default:
                            console.error("unkown msg:", e.data);
                    }
                }
            }
        },


    });
</script>

<style scoped>
  .sidebar {
    height: 100%;
    width: 0;
    position: fixed;
    z-index: 1;
    top: 0;
    right: 0;
    background-color: rgba(10, 20, 30, 0.9);
    color: #fff;
    overflow-x: hidden;
    transition: 0.3s;
  }
</style>
