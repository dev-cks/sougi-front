<template>
  <div>
    <vNavigation ></vNavigation>
    <div>
      <p>ご記帳ありがとうございました。<br>
        マイページへログイン後、ご香典のお預けや弔花のご依頼が承れます。</p>

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

        <button  class="login btn" @click="completeProfile()">
          次に進む
        </button>


      </div>
    </div>


    <vFooter></vFooter>
  </div>

</template>

<script>
    import Vue from 'vue';
    import {setCookie} from '../util/support';
    import {KEY_REGISTER_STEP, KEY_USER_MOBILE, REGISTER_NEXT} from '../config/constants';
    import {validationMixin} from 'vuelidate';
    import {required, email, maxLength, minLength} from 'vuelidate/lib/validators';
    import {
        API_BASE
    } from '../config/constants';

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
                    if(data.type == 'check_code') {
                        ref.loader.hide();
                        if(data.content.status == true) {
                            ref.updateData();
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
            updateData() {
                let id = this.$route.params.id;
                setCookie(KEY_USER_MOBILE + id, this.mobile);
                setCookie(KEY_REGISTER_STEP + id, REGISTER_NEXT);
                this.$router.push({
                    path: '/notknowother/' + id
                });
            },
            completeProfile() {
                this.submitted = true;
                this.$v.$touch();
                if (this.$v.$invalid) {
                    return;
                }
                this.submitted = false;

                let data = {
                    mobile: this.mobile,
                    code: this.code
                };
                this.connection.send(JSON.stringify({
                    type: 'api',
                    method: 'user',
                    path: 'check_code',
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


</style>
