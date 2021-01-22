<template>
  <div>
    <vNavigation ></vNavigation>
    <div class="form">


      <div class="form-group d-flex-1 align-items-center">
        <label for="mobile">お電話番号</label>
        <div class="d-flex">
          <input type="number" class="ml-3-1 form-control" id="mobile" v-model="mobile" >
          <button class="ml-2 btn-danger rounded" @click="sendCode()" :disabled="!isEnabled">Send</button>
        </div>
        <span v-if="!isEnabled">{{convertTime(timeRemain)}}</span>
        <span v-else>&nbsp;</span>

        <div class="invalid-feedback d-block">
          <span v-if="(submitted || submitCode) && !$v.mobile.required">Please insert phone number</span>
          <span v-else>&nbsp;</span>
        </div>
      </div>

      <div class="form-group d-flex-1 align-items-center">
        <label for="mobile">検証コード</label>
        <input type="number" class="ml-3-1 form-control" id="code" v-model="code" >



        <div class="invalid-feedback d-block">
          <span v-if="submitted && !$v.code.required">Please insert verification code</span>
          <span v-else>&nbsp;</span>
        </div>
      </div>


      <div class="d-flex justify-content-center">
        <button class="mt-2 btn background-main" @click="submit()">ログインする</button>
      </div>

    </div>

    <vFooter></vFooter>
  </div>

</template>

<script>
    import Vue from 'vue';
    import {validationMixin} from 'vuelidate';
    import {required, email, maxLength, minLength} from 'vuelidate/lib/validators';
    import {
        API_BASE, KEY_USER_MOBILE
    } from '../config/constants';
    import {getCookie, setCookie} from '../util/support';
    import {KEY_ALLOW_COOKIE, KEY_MEMBER_ID, KEY_USER_NAME, KEY_UUID, KEY_VIEWER_ID} from "../config/constants";
    export default Vue.extend({
        mixins: [validationMixin],
        validations: {
            mobile: {
                required
            },
            code: {
                required
            },
        },
        data() {
            return {
                submitted: false,
                submitCode: false,
                mobile: null,
                code: null,
                connection: null,
                loader: null,
                isEnabled: true,
                timeRemain: 0
            };
        },

        created(){
            this.socketConnection();
        },

        methods: {
            socketConnection() {
                this.connection = new WebSocket(API_BASE);
                let ref = this;
                this.connection.onmessage = function(event) {
                    console.log(event);
                    let data = JSON.parse(event.data);
                    if(data.type == 'login_code') {
                        ref.loader.hide();
                        if(data.status == true) {
                            ref.updateData(data.data);
                        }

                    } else if(data.type == 'send_code') {

                    }
                };
                this.connection.onopen = function(event) {
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
            createLoader() {
                this.loader = this.$loading.show({
                    // Optional parameters
                    container: null,
                    canCancel: true,
                });
            },
            countDown() {
                this.timeRemain = this.timeRemain - 1;
                if(this.timeRemain == 0) {
                    this.isEnabled = true;
                } else {
                    setTimeout(this.countDown, 1000);
                }
            },
            convertTime(time) {
                let str = '';
                if(time < 60) {
                    str = time + ' second';
                } else {
                    let minutes = Math.floor(time / 60);
                    str = minutes + " minutes";
                    if(time % 60 != 0) {
                        str = str + " " + (time % 60) + ' second';
                    }

                }
                return str + ' left';
            },
            updateData(data) {
                let id = this.$route.params.id;
                let uuid = data.uuid;
                let member_id = data.id;
                let viewer_id = member_id;
                setCookie(KEY_USER_NAME + id, data.name);
                setCookie(KEY_MEMBER_ID + id, member_id);
                setCookie(KEY_UUID + id, uuid);
                setCookie(KEY_VIEWER_ID + id, viewer_id);
                setCookie(KEY_ALLOW_COOKIE, 1);
                setCookie(KEY_USER_MOBILE + id, data.mobile);
                this.$router.push({
                    path: '/incense/' + id
                });
            },
            submit() {
                this.submitted = true;
                this.$v.$touch();
                if (this.$v.$invalid) {
                    return;
                }
                this.submitted = false;
                let id = this.$route.params.id;
                let data = {
                    mobile: this.mobile,
                    code: this.code,
                    id: id
                };
                this.connection.send(JSON.stringify({
                    type: 'api',
                    method: 'user',
                    path: 'login_code',
                    body: data
                }));
                this.createLoader();
            },
            sendCode() {

                console.log("Click send");
                this.submitCode = true;
                this.$v.$touch();
                if (!this.$v.mobile.required) {
                    return;
                }
                this.submitCode = false;

                let data = {
                    mobile: this.mobile
                }
                this.connection.send(JSON.stringify({
                    type: 'api',
                    method: 'user',
                    path: 'send_code',
                    body: data
                }));

                this.isEnabled = false;
                this.timeRemain = 60 * 5;
                setTimeout(this.countDown, 1000);
            }
        }
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
