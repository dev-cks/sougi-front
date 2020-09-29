<template>
  <div>
    <vNavigation ></vNavigation>
    <div>
      <div id="gokicho-message">
        <p>本日は、故<span class="kojin">田中太郎</span>の永眠に際し、ご記帳の為お訪ね頂いたことに深く感謝いたします。</p>

        <p>喪主　<span class="mosyu">田中 花子</span></p>
      </div>

      <div class="form">
        <div class="form-group d-flex-1 align-items-center">
          <label for="surname">苗字</label>
          <input type="text" class="ml-3-1 form-control" id="surname" v-model="surname" disabled>
        </div>

        <div class="form-group d-flex-1 align-items-center">
          <label for="name">名前</label>
          <input type="text" class="ml-3-1 form-control" id="name" v-model="name" disabled>
        </div>
        <div class="form-group d-flex-1 align-items-center">
          <label for="email">メールアドレス</label>
          <input type="text" class="ml-3-1 form-control" id="email" v-model="email">
          <div class="invalid-feedback d-block">
            <span v-if="submitted && !$v.email.required">Please insert email</span>
            <span v-else-if="submitted && !$v.email.email">Please insert valid email</span>
            <span v-else>&nbsp;</span>
          </div>
        </div>
        <div class="form-group d-flex-1 align-items-center">
          <label for="mobile">お電話番号</label>
          <input type="number" class="ml-3-1 form-control" id="mobile" v-model="mobile" disabled>
        </div>

        <div class="form-group d-flex-1 align-items-center">
          <label for="address">ご住所</label>
          <input type="text" class="ml-3-1 form-control" id="address" v-model="address" >
          <div class="invalid-feedback d-block">
            <span v-if="submitted && !$v.address.required">Please insert address</span>
            <span v-else>&nbsp;</span>
          </div>
        </div>

        <div class="form-group d-flex-1 align-items-center">
          <label for="post">郵便番号<span class="pass">（ハイフンなし）</span></label>
          <input type="number" class="ml-3-1 form-control" id="post" v-model="post" >
          <div class="invalid-feedback d-block">
            <span v-if="submitted && !$v.post.required">Please insert post code</span>
            <span v-else>&nbsp;</span>
          </div>
        </div>

        <div class="form-group d-flex-1 align-items-center">
          <label for="password">パスワード <span class="pass"> (マイページログイン時に必要となります。)</span></label>
          <input type="password" class="ml-3-1 form-control" id="password" v-model="password" >
          <div class="invalid-feedback d-block">
            <span v-if="submitted && !$v.password.required">Please insert password</span>
            <span v-else-if="submitted && !$v.password.minLength">Password require at least {{$v.password.$params.minLength.min}} length</span>
            <span v-else>&nbsp;</span>
          </div>
        </div>

        <div class="form-group">
          <input type="checkbox" name="privacy" v-model="accept">プライバシーポリシーに同意する
          <div>
            <router-link to="/pol" class="pol" target=”_blank”>
              プライバシーポリシーを見る
            </router-link>
          </div>

        </div>
        <div class="d-flex justify-content-center">
          <button class="mt-2 btn background-main" @click="submit()" :disabled="!accept">入力内容を確認する</button>
        </div>
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
        API_BASE
    } from '../config/constants';
    import {getCookie, setCookie} from '../util/support';
    import {
        KEY_USER_NAME,
        KEY_VIEWER_ID,
        KEY_REGISTER_STEP,
        REGISTER_INFO,
        KEY_MEMBER_ID,
        KEY_MEMBER_ID_PRE, KEY_USER_MOBILE
    } from '../config/constants';

    export default Vue.extend({
        mixins: [validationMixin],
        validations: {
            email: {
                required, email
            },
            address: {
                required
            },
            post: {
                required
            },
            password: {
                required, minLength: minLength(8)
            }
        },
        data() {
            return {
                submitted: false,
                id: this.$route.params.id,
                email: null,
                surname: null,
                name: null,
                full_name: null,
                mobile: null,
                address: null,
                post: null,
                password: null,
                accept: false,
                connection: null,
                loader: null
            };
        },

        created(){
            this.full_name = getCookie(KEY_USER_NAME + this.id);
            this.mobile = getCookie(KEY_USER_MOBILE + this.id);
            let split = this.full_name.split("_");
            this.name = split[0];
            this.surname = split[1];

            this.connection = new WebSocket(API_BASE);
            let ref = this;
            this.connection.onmessage = function(event) {
                ref.loader.hide();
                let data = JSON.parse(event.data);
                  if(data.status == true) {
                      ref.updateData(data);
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
            onFileChange(e) {
                this.file = e.target.files[0];
                this.url = URL.createObjectURL(this.file);
            },
            updateData(result) {
                let member_id = result.id;
                setCookie(KEY_MEMBER_ID_PRE + this.id, member_id);
                setCookie(KEY_REGISTER_STEP + this.id, REGISTER_INFO);
                this.$router.push({
                    path: '/bkeeping/' + this.id
                });
            },
            submit() {
                this.submitted = true;
                this.$v.$touch();
                if (this.$v.$invalid) {
                    return;
                }
                this.submitted = false;
                let data = {
                    id: this.id,
                    name: this.full_name,
                    email: this.email,
                    user_id: getCookie(KEY_VIEWER_ID + this.id),
                    address: this.address,
                    post: this.post,
                    mobile: this.mobile,
                    password: this.password
                };

                this.connection.send(JSON.stringify({
                    type: 'api',
                    method: 'user',
                    path: 'register_member',
                    body: data
                }));
                this.createLoader();



            }
        }
    });

</script>

<style>


</style>
