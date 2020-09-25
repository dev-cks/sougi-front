<template>
  <div>
    <vNavigation ></vNavigation>
    <div class="form">


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
        <label for="password">パスワード</label>
        <input type="password" class="ml-3-1 form-control" id="password" v-model="password">
        <div class="invalid-feedback d-block">
          <span v-if="submitted && !$v.password.required">Please insert password</span>
          <span v-else-if="submitted && !$v.password.minLength">Password require at least {{$v.password.$params.minLength.min}} length</span>
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
        loginUser
    } from '../api/user';
    import {getCookie, setCookie} from '../util/support';
    import {KEY_ALLOW_COOKIE, KEY_MEMBER_ID, KEY_USER_NAME, KEY_UUID, KEY_VIEWER_ID} from "../config/constants";
    export default Vue.extend({
        mixins: [validationMixin],
        validations: {
            email: {
                required, email
            },
            password: {
                required, minLength: minLength(8)
            }
        },
        data() {
            return {
                submitted: false,
                email: null,
                password: null,
            };
        },

        created(){

        },

        methods: {
            submit() {
                this.submitted = true;
                this.$v.$touch();
                if (this.$v.$invalid) {
                    return;
                }
                this.submitted = false;
                let id = this.$route.params.id;
                let data = {
                    id: id,
                    email: this.email,
                    password: this.password
                };

                loginUser(data).then(response => {
                    let data = response.data;
                    if(data.length > 0) {
                        data = data[0];
                        let uuid = data.uuid;
                        let member_id = data.id;
                        let viewer_id = data.viewer_id;
                        setCookie(KEY_USER_NAME + id, data.name);
                        setCookie(KEY_MEMBER_ID + id, member_id);
                        setCookie(KEY_UUID + id, uuid);
                        setCookie(KEY_VIEWER_ID + id, viewer_id);
                        setCookie(KEY_ALLOW_COOKIE, 1);
                        this.$router.push({
                            path: '/incense/' + id
                        });
                    }
                });
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
