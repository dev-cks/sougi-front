<template>
  <div>
    <vNavigation :status="status"></vNavigation>
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
          <table class="table table-striped table-bordered" v-show="detail.schedules.length>0">
            <tr>
              <td class="v-middle text-center">弔事などの予定</td>
              <td class="v-middle text-center">日時</td>
              <td class="v-middle text-center">場所</td>
            </tr>
            <tr v-for="item in detail.schedules" :key="item.id">
              <td class="text-center v-middle">{{item.type}}</td>
              <td class="text-center v-middle">{{item.start_date}}</td>
              <td class="text-center v-middle">{{item.name}}</td>
            </tr>
          </table>
        </div>
      </div>
      <div class="mt-3">
        <h3>ご登録情報</h3>

        <div class="form-group d-flex-1 align-items-center">
          <label for="name">お名前</label>
          <input type="text" class="ml-3-1 form-control" id="name" v-model="name" >
        </div>
        <div class="form-group d-flex-1 align-items-center">
          <label for="mobile">お電話番号</label>
          <input type="number" class="ml-3-1 form-control" id="mobile" v-model="mobile" >
        </div>

        <div class="form-group d-flex-1 align-items-center">
          <label for="company_name">会社名</label>
          <input type="text" class="ml-3-1 form-control" id="company_name" v-model="company_name">
          <div class="invalid-feedback d-block">
            <span v-if="submitted && !$v.company_name.required">Please insert Company name</span>
            <span v-else-if="submitted && !$v.surname.minLength">Company name require </span>
            <span v-else>&nbsp;</span>
          </div>
        </div>
        <div class="form-group d-flex-1 align-items-center">
          <label for="zip">郵便番号</label>
          <input type="text" class="ml-3-1 form-control" id="zip" v-model="zip">
          <div class="invalid-feedback d-block">
            <span v-if="submitted && !$v.surname.required">Please insert zip</span>
            <span v-else-if="submitted && !$v.surname.minLength">Zip require </span>
            <span v-else>&nbsp;</span>
          </div>
        </div>
        <div class="form-group d-flex-1 align-items-center">
          <label for="address">住所</label>
          <input type="text" class="ml-3-1 form-control" id="address" v-model="address">
          <div class="invalid-feedback d-block">
            <span v-if="submitted && !$v.surname.required">Please insert address</span>
            <span v-else-if="submitted && !$v.surname.minLength">Address require </span>
            <span v-else>&nbsp;</span>
          </div>
        </div>
        <div class="form-group d-flex-1 align-items-center">
          <label for="build_name">建物名など</label>
          <input type="text" class="ml-3-1 form-control" id="build_name" v-model="build_name">
          <div class="invalid-feedback d-block">
            <span v-if="submitted && !$v.surname.required">Please insert build name</span>
            <span v-else-if="submitted && !$v.surname.minLength">Build name require </span>
            <span v-else>&nbsp;</span>
          </div>
        </div>
        <div class="form-group d-flex-1 align-items-center">
          <label for="telephone">会社の電話番号</label>
          <input type="text" class="ml-3-1 form-control" id="telephone" v-model="telephone">
          <div class="invalid-feedback d-block">
            <span v-if="submitted && !$v.surname.required">Please insert company telephone</span>
            <span v-else-if="submitted && !$v.surname.minLength">Company telephone require </span>
            <span v-else>&nbsp;</span>
          </div>
        </div>
      </div>
      <div class="mt-3">

        <div class="d-flex justify-content-center">
          <button class="mt-2 btn text-black" @click="changeProfile()">プロファイルを変更する</button>
        </div>
      </div>
      <div class="mt-3">
        <h3>ご香典・お花・ご弔電</h3>
        <p>ご香典：<span class="mypage-koden">{{money}}</span>円をお預かりしております。</p>
        <p>お　花：<span class="mypage-choka">{{flower}}</span>円をご注文して頂いております。</p>
        <p>ご弔電：<span class="mypage-choden">{{condolence}}</span>円をご注文して頂いております。</p>

        <div class="d-flex justify-content-center">
          <button class="mt-2 btn incensebtn" @click="moveIncense()">ご香典・お花をお申込む</button>
        </div>
      </div>

    </div>

    <vFooter></vFooter>
  </div>

</template>

<script>
    import Vue from 'vue';
    import {
        API_BASE
    } from '../config/constants';
    import {validationMixin} from 'vuelidate';
    import {required, sameAs, maxLength, minLength} from 'vuelidate/lib/validators';
    import {getCookie} from '../util/support';
    import {KEY_USER_NAME, KEY_USER_MOBILE, KEY_CURRENT_FUNERAL_ID, KEY_MEMBER_ID} from '../config/constants';

    export default Vue.extend({
        mixins: [validationMixin],
        validations: {

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
            mobile: {
                required,
            },
            name: {
                required, minLength: minLength(1)
            }
        },
        data() {
            return {
                submitted: false,
                name: null,
                company_name: null,
                zip: null,
                address: null,
                build_name: null,
                telephone: null,
                mobile: null,
                member_id: null,
                money: 0,
                flower: 0,
                condolence: 0,
                connection: null,
                loader: null,
                detail: null
            };
        },

        created(){
            this.socketConnection();
        },

        beforeRouteEnter (to, from, next) {
            let id = getCookie(KEY_CURRENT_FUNERAL_ID);
            if(id != undefined) {
                let member = getCookie(KEY_MEMBER_ID + id);
                if(member != undefined) {
                    next();
                    return ;
                }
            }
            next('/');
        },

        methods: {
            socketConnection() {
                this.connection = new WebSocket(API_BASE);
                let ref = this;
                this.connection.onmessage = function(event) {
                    ref.loader.hide();
                    let data = JSON.parse(event.data);
                    console.log(data);
                    if(data.type == 'get_member') {
                        if(data.status == true) {
                            ref.updateData(data.content);
                            ref.getDeathDetail();
                        }
                    } else if(data.type = 'get_info') {
                        ref.detail = data.detail;
                    } else if(data.type == 'change_profile') {
                        setCookie(KEY_USER_NAME + id, this.name);
                        setCookie(KEY_USER_MOBILE + id, this.mobile);
                    }

                };
                this.connection.onopen = function(event) {
                    console.log("Connection open again");
                    if(!ref.email) {
                        ref.getMemberInfo();

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
            createLoader() {
                this.loader = this.$loading.show({
                    // Optional parameters
                    container: null,
                    canCancel: true,
                });
            },
            getDeathDetail(){
                this.createLoader();
                let id = getCookie(KEY_CURRENT_FUNERAL_ID);
                let data = {
                    id: id
                };
                console.log("Body is " + this.id);
                this.connection.send(JSON.stringify({
                    type: 'api',
                    method: 'funeral',
                    path: 'get_info',
                    body: data
                }));
            },
            updateData(data) {
                let user = data.user[0];
                let full_name = user.name;
                this.name = full_name;
                this.mobile = user.mobile;
                this.address = user.address;
                this.zip = user.zip;
                this.company_name = user.company_name;
                this.build_name = user.build_name;
                this.telephone = user.telephone;
                this.money = data.money.sum;
                this.condolence = data.condolence.sum;
                this.flower = data.flower.sum;
                if(this.money == null) {
                    this.money= 0;
                }
                if(this.condolence == null) {
                    this.condolence= 0;
                }
                if(this.flower == null) {
                    this.flower= 0;
                }
            },
            getMemberInfo() {
                let id = getCookie(KEY_CURRENT_FUNERAL_ID);
                this.member_id = getCookie(KEY_MEMBER_ID + id);
                let data = {
                    member_id: this.member_id,
                    id: id
                };
                this.connection.send(JSON.stringify({
                    type: 'api',
                    method: 'user',
                    path: 'get_member',
                    body: data
                }));
                this.createLoader();

            },
            changeProfile() {
                this.submitted = true;
                this.$v.$touch();
                if (this.$v.$invalid) {
                    return;
                }
                this.submitted = false;

                if(this.password == this.confirm) {
                    console.log("Change Profile");
                    let data = {
                        member_id: this.member_id,
                        name: this.name,
                        company_name: this.company_name,
                        address: this.address,
                        zip: this.zip,
                        mobile: this.mobile,
                        build_name: this.build_name,
                        telephone: this.telephone,
                    };
                    this.connection.send(JSON.stringify({
                        type: 'api',
                        method: 'user',
                        path: 'change_profile',
                        body: data
                    }));
                    this.createLoader();

                }

            },
            moveIncense() {
                let id = getCookie(KEY_CURRENT_FUNERAL_ID);
                this.$router.push({
                    path: '/incense/' + id
                });
            }


        }
    });

</script>

<style>

</style>
