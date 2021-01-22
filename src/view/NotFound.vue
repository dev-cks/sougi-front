<template>
  <div class="form">




    <div class="form-group d-flex-1 align-items-center">
      <h3 class="text-align-center mb-3">故人の姓名を入力してください。</h3>
    </div>
    <div class="form-group d-flex-1 align-items-center">
      <label for="surname">姓</label>
      <input type="text" class="ml-3-1 form-control" id="surname" v-model="surname">
      <div class="invalid-feedback d-block">
        <span v-if="submitted && !$v.surname.required">Please insert surname</span>
        <span v-else-if="submitted && !$v.surname.minLength">Surname require at least {{$v.surname.$params.minLength.min}} length</span>
        <span v-else>&nbsp;</span>
      </div>
    </div>

    <div class="form-group d-flex-1 align-items-center">
      <label for="name">名</label>
      <input type="text" class="ml-3-1 form-control" id="name" v-model="name">
      <div class="invalid-feedback d-block">
        <span v-if="submitted && !$v.name.required">Please insert name</span>
        <span v-else-if="submitted && !$v.name.minLength">Name require at least {{$v.name.$params.minLength.min}} length</span>
        <span v-else>&nbsp;</span>
      </div>
    </div>

    <div class="d-flex justify-content-center">
      <button class="mt-2 btn background-main" @click="submit()">記帳デ一タを送信</button>
    </div>


  </div>


</template>

<script>
    import Vue from 'vue';

    import {validationMixin} from 'vuelidate';
    import {required, maxLength, minLength} from 'vuelidate/lib/validators';
    import {
        registerUser
    } from '../api/user';

    export default Vue.extend({
        mixins: [validationMixin],
        validations: {
            surname: {
                required, minLength: minLength(1)
            },
            name: {
                required, minLength: minLength(1)
            }
        },
        data() {
            return {
                submitted: false,
                surname: null,
                name: null,
                url: null,
                file: null,
                id: null,
            };
        },

        created() {
            console.log("Id is " + this.id);
            console.log(this.$route.params);

        },

        methods: {

            submit() {
                this.submitted = true;
                this.$v.$touch();
                if (this.$v.$invalid) {
                    return;
                }

                this.submitted = false;

                let full_name = this.name + "_" + this.surname;
                this.$router.push({
                    path: '/main?name=' + full_name
                });
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

  .text-align-center {
    text-align: center;
  }

</style>
