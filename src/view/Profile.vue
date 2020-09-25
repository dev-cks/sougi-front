<template>
  <div>
    <vNavigation :status="status"></vNavigation>
    <div>
      <div>
        <h3>ご登録情報</h3>
        <p>姓：<span class="mypage-firstname">{{surname}}</span></p>
        <p>名：<span class="mypage-lastname">{{name}}</span></p>
        <p>電話番号：<span class="mypage-tel">{{mobile}}</span></p>
        <p>住所：<span class="mypage-address">{{address}}</span></p>
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

      <div class="mt-3">
        <h3>パスワード変更</h3>
        <div class="form-group d-flex-1 align-items-center">
          <label for="password">メールアドレス</label>
          <input type="password" class="ml-3-1 form-control" id="password" v-model="password">
          <div class="invalid-feedback d-block">
            <span v-if="submitted && !$v.password.required">Please insert password</span>
            <span v-else-if="submitted && !$v.password.minLength">Password require at least {{$v.password.$params.minLength.min}} length</span>
            <span v-else>&nbsp;</span>
          </div>
        </div>

        <div class="form-group d-flex-1 align-items-center">
          <label for="confirm">パスワード</label>
          <input type="password" class="ml-3-1 form-control" id="confirm" v-model="confirm">
          <div class="invalid-feedback d-block">
            <span v-if="submitted && !$v.confirm.required">Please insert password confirm</span>
            <span v-else-if="submitted && !$v.confirm.minLength">Password confirm require at least {{$v.confirm.$params.minLength.min}} length</span>
            <span v-else-if="submitted && !$v.confirm.sameAsPassword">Password confirm should be same with password</span>
            <span v-else>&nbsp;</span>
          </div>
        </div>

        <div class="d-flex justify-content-center">
          <button class="mt-2 btn text-black" @click="changePassword()">パスワードを変更する</button>
        </div>
      </div>
    </div>

    <vFooter></vFooter>
  </div>

</template>

<script>
    import Vue from 'vue';
    import {
        getUserInfo,
        updatePassword
    } from '../api/user';
    import {validationMixin} from 'vuelidate';
    import {required, sameAs, maxLength, minLength} from 'vuelidate/lib/validators';
    import {getCookie} from '../util/support';
    import {KEY_CURRENT_FUNERAL_ID, KEY_MEMBER_ID} from '../config/constants';

    export default Vue.extend({
        mixins: [validationMixin],
        validations: {

            password: {
                required, minLength: minLength(8)
            },
            confirm: {
                required, minLength: minLength(8), sameAsPassword: sameAs('password')
            }
        },
        data() {
            return {
                submitted: false,
                email: null,
                surname: null,
                name: null,
                mobile: null,
                address: null,
                post: null,
                password: null,
                confirm: null,
                member_id: null,
                money: 0,
                flower: 0,
                condolence: 0
            };
        },

        created(){
            this.getMemberInfo();
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
            getMemberInfo() {
                let id = getCookie(KEY_CURRENT_FUNERAL_ID);
                this.member_id = getCookie(KEY_MEMBER_ID + id);
                let data = {
                    member_id: this.member_id,
                    id: id
                };
                getUserInfo(data).then(response => {
                    let data = response.data;
                    console.log(data);
                    let user = data.user[0];
                    let full_name = user.name;
                    let split = full_name.split('_');
                    this.name = split[0];
                    this.surname = split[1];
                    this.email = user.email;
                    this.mobile = user.mobile;
                    this.address = user.address;
                    this.post = user.post;
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
                })

            },
            changePassword() {
                this.submitted = true;
                this.$v.$touch();
                if (this.$v.$invalid) {
                    return;
                }
                this.submitted = false;
                if(this.password == this.confirm) {
                    let data = {
                        member_id: this.member_id,
                        password: this.password
                    };
                    updatePassword(data).then(response => {
                        console.log(response);
                    });
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
