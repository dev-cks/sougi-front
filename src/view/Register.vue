<template>
  <div class="form">
    <vNavigation></vNavigation>
    <div class="form-group">
      <div id="preview">
        <VueSignaturePad  ref="signaturePad"  width="480px" height="600px" style="border: 1px solid #ced4da"
        />

      </div>
      <div class="d-flex justify-content-center">
        <button class="mt-2 btn text-black" @click="clearImage()">鮮明な画像</button>
      </div>

      <input type="file" @change="onFileChange" ref="file" style="display: none"/>
    </div>




    <div class="form-group d-flex-1 align-items-center">
      <label for="name">お名前</label>
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
            name: {
                required, minLength: minLength(1)
            },

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
                url: null,
                file: null,
                id: null,
                connection: null,
                loader: null,
                canvas: null
            };
        },

        created() {
            this.socketConnection();
        },
        mounted() {
            var c = document.getElementById("myCanvas");
            this.canvas = c.getContext('2d');
        },

        methods: {
            socketConnection() {
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

                this.connection.onclose = function(e) {
                    setTimeout(function() {
                        ref.socketConnection()
                    }, 1000);
                };

                this.connection.onerror = function(err) {
                    ref.connection.close();
                };
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
                let user_id = data.id;
                let uuid = data.uuid;
                setCookie(KEY_USER_NAME + this.id, this.name);
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
                // if(this.file == null) {
                //     alert("Please add image file");
                //     return ;
                // }
                this.id = this.$route.params.id;
                const { isEmpty, data } = this.$refs.signaturePad.saveSignature();
                //let src = c.toDataURL("image/png");

                let postData = {
                    id: this.id,
                    name: this.name,
                    file: data
                };

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

</style>
