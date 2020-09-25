<template>
  <div>
    <vNavigation ></vNavigation>
    <div class="form">

      <a class="text-underline" href="javascript:void(0);" @click="moveBack()">戻る</a>

      <div class="mt-4">
        <div class="form-group d-flex-1 align-items-center" v-if="member_id == 'undefined'">
          <label for="email">メールアドレス</label>
          <input type="text" class="ml-3-1 form-control" id="email" v-model="email">
        </div>

        <div class="form-group d-flex-1 align-items-center">
          <label for="content">問い合わせ内容</label>
          <textarea type="text" class="ml-3-1 form-control" id="content" v-model="content"></textarea>
        </div>

        <div class="d-flex justify-content-center">
          <button class="mt-2 btn background-main" @click="submit()">メッセージを送る</button>
        </div>
      </div>



    </div>





    <vFooter></vFooter>
  </div>

</template>

<script>
    import Vue from 'vue';
    import {
        uploadInquiry
    } from '../api/inquiry';
    import {getCookie} from '../util/support';
    import {KEY_CURRENT_FUNERAL_ID, KEY_MEMBER_ID} from '../config/constants';
    export default Vue.extend({
        data() {
            return {
                email: null,
                content: null,
                member_id: null
            };
        },

        created(){
            let funeral_id = getCookie(KEY_CURRENT_FUNERAL_ID);
            this.member_id = getCookie(KEY_MEMBER_ID + funeral_id);
            console.log(this.member_id);
        },

        methods: {
            moveBack() {
                history.back()
            },
            submit() {
                let type = this.$route.params.type;
                let data = {
                    member_id: this.member_id,
                    email: this.email,
                    content: this.content,
                    type: type,
                };
                uploadInquiry(data).then(response => {
                    let data = response.data;
                    console.log(data);
                });
            }
        }
    });

</script>

<style>


</style>
