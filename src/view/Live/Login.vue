<template>
  <div class="form">



    <div class="form-group d-flex-1 align-items-center">
      <label for="type">ユーザー種類</label>
      <select class="form-control" id="type" v-model="type">
        <option value="1">喪主</option>
        <option value="2">撮影が</option>
      </select>

    </div>
    <div class="form-group d-flex-1 align-items-center" v-if="type == 2">
      <label for="mobile">お電話番号</label>
      <input type="number" class="ml-3-1 form-control" id="mobile" v-model="mobile">
      <div class="invalid-feedback d-block">
        <span v-if="submitted && !$v.mobile.required">Please insert mobile number</span>
        <span v-else>&nbsp;</span>
      </div>
    </div>

    <div class="form-group d-flex-1 align-items-center">
      <label for="mobile">訃報ID</label>
      <input type="text" class="ml-3-1 form-control" id="code" v-model="code">
      <div class="invalid-feedback d-block">
        <span v-if="submitted && !$v.code.required">Please insert funeral id</span>
        <span v-else>&nbsp;</span>
      </div>
    </div>

    <div class="d-flex justify-content-center">
      <button class="mt-2 btn background-main" @click="submit()">決定する</button>
    </div>


  </div>


</template>

<script>
    import Vue from 'vue';
    import {
        API_BASE, KEY_MANAGE_MUSIC, KEY_MANAGE_ORIGINAL_MUSIC
    } from '../../config/constants';
    import {validationMixin} from 'vuelidate';
    import {required, maxLength, minLength} from 'vuelidate/lib/validators';
    import {setCookie} from "../../util/support";
    import {
        KEY_CAMERA_ID,
        KEY_CAMERA_MOBILE,
        KEY_CAMERA_PORT,
        KEY_MANAGE_CAMERA, KEY_MANAGE_ID,
        KEY_MANAGE_NAME, KEY_MANAGE_PORT
    } from "../../config/constants";

    export default Vue.extend({
        mixins: [validationMixin],
        validations: {
            mobile: {
                required
            },
            code: {
                required
            }
        },
        data() {
            return {
                submitted: false,
                type: 1,
                mobile: null,
                code: null,
                connection: null,
                loader: null
            };
        },

        created() {
            //removeCookie(KEY_ALLOW_COOKIE);
            this.connection = new WebSocket(API_BASE);
            let ref = this;
            this.connection.onmessage = function(event) {
                ref.loader.hide();
                //this.isLoading = false;
                let data = JSON.parse(event.data);
                let json = data.content;
                if(json.status == 2) {
                    let info = json.info;
                    setCookie(KEY_CAMERA_PORT, info.port);
                    //setCookie(KEY_CAMERA_ID, info.id);
                    setCookie(KEY_CAMERA_MOBILE, ref.mobile);
                    console.log("Set cookie is " + ref.mobile);
                    ref.$router.push({
                        path: '/live/camera',
                    });
                } else if(json.status == 1) {
                    let info = json.info;
                    setCookie(KEY_MANAGE_ID, info.id);
                    setCookie(KEY_MANAGE_PORT, info.port);
                    let camera_arr = [];
                    if(info.camera1 > 0) {
                        camera_arr.push(info.camera1);
                    }
                    if(info.camera2 > 0) {
                        camera_arr.push(info.camera2);
                    }
                    if(info.camera3 > 0) {
                        camera_arr.push(info.camera3);
                    }
                    let music = info.music;
                    let original_music = info.original_music;
                    if(music && music != '') {
                        setCookie(KEY_MANAGE_MUSIC, music);
                        setCookie(KEY_MANAGE_ORIGINAL_MUSIC, original_music);
                    }

                    setCookie(KEY_MANAGE_CAMERA, camera_arr);
                    setCookie(KEY_MANAGE_NAME, info.name);
                    ref.$router.push({
                        path: '/live/manage',
                    });
                }
            };
            this.connection.onopen = function(event) {
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
            submit() {
                this.submitted = true;
                if(this.type == 1) {
                    this.mobile = '1234';
                }
                this.$v.$touch();
                if (this.$v.$invalid) {
                    return;
                }

                if(this.type == 1) {
                    this.mobile = '';
                }

                this.submitted = false;

                this.connection.send(JSON.stringify({
                    type: 'api',
                    method: 'channel',
                    path: 'get_detail',
                    body: {
                        mobile: this.mobile,
                        code: this.code,
                        type: this.type
                    }
                }));
                this.createLoader();

            }
        },


    });

</script>

<style>

  #preview {
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid black;
    width: 100%;
    height: 300px;
  }

  #preview img {
    width: 100%;
    height: 100%;
  }

</style>
