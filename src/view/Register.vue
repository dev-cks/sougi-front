<template>
  <div class="form">
    <vNavigation></vNavigation>
    <div class="form-group">
      <div id="preview">
        <img v-if="url" :src="url"/>
        <template v-else>

        </template>

      </div>
      <div class="d-flex justify-content-center">
        <button class="mt-2 btn text-black" @click="$refs.file.click()">画像を挿入</button>
      </div>

      <input type="file" @change="onFileChange" ref="file" style="display: none"/>
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
    <vFooter></vFooter>

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
                required, minLength: minLength(5)
            },
            name: {
                required, minLength: minLength(5)
            }
        },
        data() {
            return {
                submitted: false,
                surname: null,
                name: null,
                url: null,
                file: null,
                id: null
            };
        },

        created() {
            console.log("Id is " + this.id);
            console.log(this.$route.params);
        },

        methods: {
            onFileChange(e) {
                this.file = e.target.files[0];
                this.url = URL.createObjectURL(this.file);
            },
            submit() {
                this.submitted = true;
                this.$v.$touch();
                if (this.$v.$invalid) {
                    return;
                }
                this.submitted = false;
                console.log('submit');
                console.log('this');
                let id = this.$route.params.id;
                let data = new FormData();

                data.append('id', id);
                data.append('surname', this.surname);
                data.append('name', this.name);
                data.append('file', this.file);
                registerUser(data).then(response => {
                    let data = response.data;
                    let user_id = data.id;
                    let uuid = data.uuid;
                    localStorage.setItem("sougi-user-id" + id, user_id);
                    localStorage.setItem("sougi-user-name" + id, this.name + '_' + this.surname);
                    localStorage.setItem("sougi-uuid" + id, uuid);
                    this.$router.push({
                        path: '/complete/' + id
                    });
                });
            }
        },

        watch: {
            'surname': function (newVal) {
                this.surname = newVal;
                this.$v.$touch();
                console.log(this.$v.surname.minlength);
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
