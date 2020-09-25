<template>
  <div>
    <vNavigation ></vNavigation>
    <div>
      <p>ご記帳ありがとうございました。<br>
        マイページへログイン後、ご香典のお預けや弔花のご依頼が承れます。</p>

      <div class="form">
        <div class="form-group d-flex-1 align-items-center">
          <label for="mobile">お電話番号</label>
          <input type="number" class="ml-3-1 form-control" id="mobile" v-model="mobile" >
          <div class="invalid-feedback d-block">
            <span v-if="(submitted || submitCode) && !$v.mobile.required">Please insert phone number</span>
            <span v-else>&nbsp;</span>
          </div>
        </div>

        <div class="form-group d-flex-1 align-items-center">
          <label for="mobile">検証コード</label>
          <div class="d-flex">
            <input type="number" class="ml-3-1 form-control" id="code" v-model="code" >
            <button class="ml-2 btn-danger rounded" @click="sendCode()">Send</button>
          </div>


          <div class="invalid-feedback d-block">
            <span v-if="submitted && !$v.mobile.required">Please insert verification code</span>
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
        sendCode,
        checkCode
    } from '../api/user';

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
                code: null
            };
        },

        created(){

        },

        methods: {
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
                }
                checkCode(data).then(response => {
                   let result = response.data;
                   console.log(result);
                   if(result.status == true) {
                       let id = this.$route.params.id;
                       setCookie(KEY_USER_MOBILE + id, this.mobile);
                       setCookie(KEY_REGISTER_STEP + id, REGISTER_NEXT);
                       this.$router.push({
                           path: '/notknowother/' + id
                       });
                   } else {

                   }
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
                console.log("Call API");
                let data = {
                    mobile: this.mobile
                }
                sendCode(data).then(response => {
                   console.log(response);
                });
            }
        }
    });

</script>

<style>


</style>
