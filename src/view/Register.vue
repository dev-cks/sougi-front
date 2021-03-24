<template>
  <div>
    <div class="funeral" v-if="detail">
      <div class="funeral_body">
        <h5 class="text-center">故人</h5>
        <h3 class="text-center">{{detail.name}}</h3>
        <div class="d-flex justify-content-center">
          <h5 class="mr-5">享年 {{detail.age}}歳</h5>
          <h5>{{detail.end_date}} 逝去</h5>
        </div>
        <pre class="mt-5 mb-5">{{detail.detail}}</pre>
        <h5 class="mb-3">喪主 : {{detail.manager_name}}</h5>
        <label class="mb-0 mr-3" style="font-weight: bold">葬儀日程の記述</label>
        <div class="w-100 schedule-container" v-show="detail.schedules.length>0">
          <div class="schedule d-flex">
            <div class="head">葬儀内容</div>
            <div class="content">実施スケジュール</div>
          </div>
          <div v-for="item in detail.schedules" :key="item.id" >
            <div class="schedule d-flex">
              <div class="head">{{item.type}}</div>
              <div class="content">
                <div class="text-center">
                  {{formatDate(item.start_date)}}
                </div>
                <div class="text-center border-top">
                  {{formatTime(item.start_time) + " ~ " + formatTime(item.end_time)}}
                </div>
              </div>
            </div>

            <div class="schedule d-flex">
              <div class="head">場所</div>
              <div class="content">
                <div class="text-center">
                  {{item.name}}
                </div>
                <div class="text-center border-top">
                  {{item.state + " " + item.city + " " + item.street + " " + item.build_name}}
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
    <div class="form">
      <vNavigation></vNavigation>
      <div class="form-group" v-if="detail && detail.image_status == 1">
        <div id="preview">
          <VueSignaturePad  ref="signaturePad"  width="480px" height="360px" style="border: 1px solid #ced4da"
          />

        </div>
        <div class="d-flex justify-content-center">
          <button class="mt-2 btn text-black" @click="clearImage()">鮮明な画像</button>
        </div>

        <input type="file" @change="onFileChange" ref="file" style="display: none"/>
      </div>





      <div class="row mt-2">
        <div class="form-group col-6 align-items-center">
          <label for="name">お名前</label>
          <input type="text" class="ml-3-1 form-control" id="name" v-model="name">
          <div class="invalid-feedback d-block">
            <span v-if="submitted && !$v.name.required">Please insert name</span>
            <span v-else-if="submitted && !$v.name.minLength">Name require at least {{$v.name.$params.minLength.min}} length</span>
            <span v-else>&nbsp;</span>
          </div>
        </div>


        <div class="form-group col-6 align-items-center">
          <label for="company_name">会社名</label>
          <input type="text" class="ml-3-1 form-control" id="company_name" v-model="company_name">
          <div class="invalid-feedback d-block">
            <span v-if="submitted && !$v.company_name.required">Please insert Company name</span>
            <span v-else-if="submitted && !$v.surname.minLength">Company name require </span>
            <span v-else>&nbsp;</span>
          </div>
        </div>
      </div>


      <div class="row">
        <div class="form-group col-6 align-items-center">
          <label for="zip">郵便番号</label>
          <input type="text" class="ml-3-1 form-control" id="zip" v-model="zip">
          <div class="invalid-feedback d-block">
            <span v-if="submitted && !$v.surname.required">Please insert zip</span>
            <span v-else-if="submitted && !$v.surname.minLength">Zip require </span>
            <span v-else>&nbsp;</span>
          </div>
        </div>
        <div class="form-group col-6 align-items-center">
          <label for="address">住所</label>
          <input type="text" class="ml-3-1 form-control" id="address" v-model="address">
          <div class="invalid-feedback d-block">
            <span v-if="submitted && !$v.surname.required">Please insert address</span>
            <span v-else-if="submitted && !$v.surname.minLength">Address require </span>
            <span v-else>&nbsp;</span>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="form-group col-6 align-items-center">
          <label for="build_name">建物名など</label>
          <input type="text" class="ml-3-1 form-control" id="build_name" v-model="build_name">
          <div class="invalid-feedback d-block">
            <span v-if="submitted && !$v.surname.required">Please insert build name</span>
            <span v-else-if="submitted && !$v.surname.minLength">Build name require </span>
            <span v-else>&nbsp;</span>
          </div>
        </div>
        <div class="form-group col-6 align-items-center">
          <label for="telephone">会社の電話番号</label>
          <input type="text" class="ml-3-1 form-control" id="telephone" v-model="telephone">
          <div class="invalid-feedback d-block">
            <span v-if="submitted && !$v.surname.required">Please insert company telephone</span>
            <span v-else-if="submitted && !$v.surname.minLength">Company telephone require </span>
            <span v-else>&nbsp;</span>
          </div>
        </div>
      </div>

      <div class="row">


        <div class="form-group col-6 align-items-center">
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
        <div class="form-group col-6 align-items-center">
          <label for="mobile">検証コード</label>
          <input type="number" class="ml-3-1 form-control" id="code" v-model="code" >



          <div class="invalid-feedback d-block">
            <span v-if="submitted && !$v.code.required">Please insert verification code</span>
            <span v-else-if="invalidCode == true">Invalid code</span>
            <span v-else>&nbsp;</span>
          </div>
        </div>
      </div>


      <div class="form-group">
        <input type="checkbox" name="privacy" v-model="accept_policy">プライバシーポリシーに同意する
        <div>
          <router-link to="/pol" class="pol" target=”_blank”>
            プライバシーポリシーを見る
          </router-link>
        </div>

      </div>

      <div class="form-group">
        <input type="checkbox" name="privacy" v-model="accept_usage">利用規約に同意する
        <div>
          <router-link to="/kiyaku" class="pol" target=”_blank”>
            利用規約を見る
          </router-link>
        </div>

      </div>


      <div class="d-flex justify-content-center">
        <button class="mt-2 btn background-main" :disabled="!accept_policy || !accept_usage" @click="submit()">記帳デ一タを送信</button>
      </div>
      <vFooter></vFooter>

    </div>
  </div>



</template>

<script>
    import Vue from 'vue';

    import {validationMixin} from 'vuelidate';
    import {required, maxLength, minLength} from 'vuelidate/lib/validators';
    import {
        API_BASE,
        KEY_ALLOW_COOKIE,
        KEY_COMPANY_ID,
        KEY_CURRENT_FUNERAL_ID,
        KEY_CURRENT_NAME,
        KEY_MEMBER_ID_PRE,
        KEY_USER_MOBILE
    } from '../config/constants';
    import {setCookie} from '../util/support';
    import {KEY_USER_NAME, KEY_VIEWER_ID, KEY_UUID, KEY_REGISTER_STEP, REGISTER_UUID} from '../config/constants';

    export default Vue.extend({
        mixins: [validationMixin],
        validations: {
            name: {
                required, minLength: minLength(1)
            },
            mobile: {
                required
            },
            code: {
                required
            },
            company_name: {
                required, minLength: minLength(1)
            },
            zip: {
                required, minLength: minLength(1)
            },
            address: {
                required, minLength: minLength(1)
            },
            build_name: {
                required, minLength: minLength(1)
            },
            telephone: {
                required,
            },
        },
        data() {
            return {
                submitted: false,
                name: null,
                submitCode: false,
                mobile: null,
                code: null,
                isEnabled: true,
                timeRemain: 0,
                company_name: null,
                zip: null,
                address: null,
                build_name: null,
                telephone: null,
                invalidCode: false,
                accept_policy: false,
                accept_usage: false,
                url: null,
                file: null,
                id: null,
                connection: null,
                loader: null,
                canvas: null,
                detail: null,
            };
        },

        created() {
            this.socketConnection();
            this.id = this.$route.params.id;
        },
        mounted() {
            var c = document.getElementById("myCanvas");
            this.canvas = c.getContext('2d');

        },

        methods: {
            formatDate(date){
                let year = date.substring(0,4);
                let month = date.substring(5,7);
                if(month<10)
                    month = parseInt(month);
                let day = date.substring(8,10);
                if(day<10)
                    day = parseInt(day);
                const d = new Date(year, parseInt(month) - 1, day);
                let weeknumber = d.getDay();
                let weekdays = ["日曜日","月曜日","火曜日","水曜日","木曜日","金曜日","土曜日"];
                return year+"年"+month+"月"+day+"日"+" "+weekdays[weeknumber];
            },
            formatTime(time){
                return time.substring(0,2)+"時"+time.substring(3,5)+"分";
            },
            socketConnection() {
                this.connection = new WebSocket(API_BASE);
                let ref = this;
                this.connection.onmessage = function(event) {
                    ref.loader.hide();
                    let data = JSON.parse(event.data);
                    console.log(data);
                    if(data.type == 'send_code') {

                    } else if(data.type == 'get_info') {
                        ref.detail = data.detail;
                        setCookie(KEY_ALLOW_COOKIE, 1);
                        setCookie(KEY_CURRENT_FUNERAL_ID, ref.detail.id);
                        setCookie(KEY_COMPANY_ID, ref.detail.company_id);
                        setCookie(KEY_CURRENT_NAME, ref.detail.code);
                    } else if(data.status == true) {
                        ref.updateData(data);
                    } else {
                        ref.invalidCode = true;
                    }
                };
                this.connection.onopen = function(event) {
                    ref.getDeathDetail();
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
            getDeathDetail(){
                this.createLoader();
                let data = {
                    id: this.id
                };
                console.log("Body is " + this.id);
                this.connection.send(JSON.stringify({
                    type: 'api',
                    method: 'funeral',
                    path: 'get_info',
                    body: data
                }));
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
            clearImage() {
                this.$refs.signaturePad.clearSignature();
            },
            drawLine(x1, y1, x2, y2) {
                let ctx = this.canvas;
                ctx.beginPath();
                ctx.strokeStyle = 'black';
                ctx.lineWidth = 3;
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
                ctx.closePath();
            },
            beginDrawing(e) {
                this.x = e.offsetX;
                this.y = e.offsetY;
                this.isDrawing = true;
            },
            keepDrawing(e) {
                if (this.isDrawing === true) {
                    this.drawLine(this.x, this.y, e.offsetX, e.offsetY);
                    this.x = e.offsetX;
                    this.y = e.offsetY;
                }
            },
            stopDrawing(e) {
                if (this.isDrawing === true) {
                    this.drawLine(this.x, this.y, e.offsetX, e.offsetY);
                    this.x = 0;
                    this.y = 0;
                    this.isDrawing = false;
                }
            },
            createLoader() {
                this.loader = this.$loading.show({
                    // Optional parameters
                    container: null,
                    canCancel: true,
                });
            },
            onFileChange(e) {
                this.file = e.target.files[0];
                this.url = URL.createObjectURL(this.file);
            },
            updateData(data) {
                console.log(data);
                console.log("Update Data");
                let user_id = data.id;
                let uuid = data.uuid;
                setCookie(KEY_USER_NAME + this.id, this.name);
                setCookie(KEY_VIEWER_ID + this.id, user_id);
                setCookie(KEY_MEMBER_ID_PRE + this.id, user_id);
                setCookie(KEY_USER_MOBILE + this.id, this.mobile);
                setCookie(KEY_UUID + this.id, uuid);
                setCookie(KEY_REGISTER_STEP + this.id, REGISTER_UUID);
                this.$router.push({
                    path: '/bkeeping/' + this.id
                });
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
            },
            submit() {
                this.submitted = true;
                this.$v.$touch();
                if (this.$v.$invalid) {
                    return;
                }
                this.submitted = false;
                // if(this.file == null) {
                //     alert("Please add image file");
                //     return ;
                // }
                this.id = this.$route.params.id;


                //let src = c.toDataURL("image/png");

                let postData = {
                    id: this.id,
                    name: this.name,
                    company_name: this.company_name,
                    address: this.address,
                    zip: this.zip,
                    mobile: this.mobile,
                    build_name: this.build_name,
                    telephone: this.telephone,
                    code: this.code,
                };

                if(this.detail.image_status == 1) {
                    const { isEmpty, data } = this.$refs.signaturePad.saveSignature();
                    postData.file = data;
                } else {

                }

                this.connection.send(JSON.stringify({
                    type: 'api',
                    method: 'user',
                    path: 'register',
                    body: postData
                }));
                this.createLoader();
            }
        },
    });

</script>

<style>
 #preview {
   height: auto !important;
   border: none !important;
 }
 .schedule .head {
   flex: 1;
   text-align: center;
   border-bottom: 1px solid black;
   border-right: 1px solid black;
   display: flex;
   justify-content: center;
   align-items: center;
 }
 .schedule .content {
   text-align: center;
   flex: 2;
   border-bottom: 1px solid black;
   border-right: 1px solid black;
 }

 .schedule .content .border-top {
   border-color: black !important;
 }

 .schedule-container {
   border-top: 1px solid black;
   border-left: 1px solid black;
 }


</style>
