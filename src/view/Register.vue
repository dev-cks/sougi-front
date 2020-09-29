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
        API_BASE
    } from '../config/constants';
    import {setCookie} from '../util/support';
    import {KEY_USER_NAME, KEY_VIEWER_ID, KEY_UUID, KEY_REGISTER_STEP, REGISTER_UUID} from '../config/constants';

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
                connection: null,
                loader: null
            };
        },

        created() {
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
            updateData(data) {
                let user_id = data.id;
                let uuid = data.uuid;
                setCookie(KEY_USER_NAME + this.id, this.name + '_' + this.surname);
                setCookie(KEY_VIEWER_ID + this.id, user_id);
                setCookie(KEY_UUID + this.id, uuid);
                setCookie(KEY_REGISTER_STEP + this.id, REGISTER_UUID);
                this.$router.push({
                    path: '/complete/' + this.id
                });
            },
            submit() {
                this.submitted = true;
                this.$v.$touch();
                if (this.$v.$invalid) {
                    return;
                }
                this.submitted = false;
                if(this.file == null) {
                    alert("Please add image file");
                    return ;
                }
                this.id = this.$route.params.id;

                let data = {
                    id: this.id,
                    surname: this.surname,
                    name: this.name,
                    //file: this.file
                };

                this.connection.send(JSON.stringify({
                    type: 'api',
                    method: 'user',
                    path: 'register',
                    body: data
                }));
                this.createLoader();
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

</style>
