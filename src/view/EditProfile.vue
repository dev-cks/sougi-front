<template>
  <div>
    <vNavigation ></vNavigation>
    <div>
      <div id="gokicho-message">
        <p>本日は、故<span class="kojin">{{death_name}}</span>の永眠に際し、ご記帳の為お訪ね頂いたことに深く感謝いたします。</p>

        <p>喪主　<span class="mosyu">{{manager_name}}</span></p>
      </div>

      <div class="form">
        <div class="form-group d-flex-1 align-items-center">
          <label for="name">お名前</label>
          <input type="text" class="ml-3-1 form-control" id="name" v-model="name" disabled>
        </div>
        <div class="form-group d-flex-1 align-items-center">
          <label for="mobile">お電話番号</label>
          <input type="number" class="ml-3-1 form-control" id="mobile" v-model="mobile" disabled>
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
    import {required, email, maxLength, minLength, sameAs} from 'vuelidate/lib/validators';
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
            }
        },
        data() {
            return {
                submitted: false,
                id: this.$route.params.id,
                name: null,
                company_name: null,
                zip: null,
                address: null,
                build_name: null,
                telephone: null,
                mobile: null,
                accept: false,
                death_name: null,
                manager_name: null,
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
            this.socketConnection();

        },

        methods: {
            socketConnection() {
                this.connection = new WebSocket(API_BASE);
                let ref = this;
                this.connection.onmessage = function(event) {
                    ref.loader.hide();
                    let data = JSON.parse(event.data);
                    if(data.type == 'get_manager') {
                        ref.updateManagerData(data.data);
                    } else {
                        if(data.status == true) {
                            ref.updateData(data);
                        }
                    }
                };
                this.connection.onopen = function(event) {
                    ref.getManagerInfo();
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
            onFileChange(e) {
                this.file = e.target.files[0];
                this.url = URL.createObjectURL(this.file);
            },
            getManagerInfo() {
                let data = {
                    id: this.id,
                };

                this.connection.send(JSON.stringify({
                    type: 'api',
                    method: 'funeral',
                    path: 'get_manager',
                    body: data
                }));
                this.createLoader();
            },
            updateManagerData(result) {
                this.death_name = result.name;
                this.manager_name = result.manager_name;
            },
            updateData(result) {
                let member_id = getCookie(KEY_VIEWER_ID + this.id);
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
                    user_id: getCookie(KEY_VIEWER_ID + this.id),
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
