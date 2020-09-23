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
        </div>
        <div class="form-group d-flex-1 align-items-center">
          <label for="mobile">お電話番号</label>
          <input type="number" class="ml-3-1 form-control" id="mobile" v-model="mobile" >
        </div>

        <div class="form-group d-flex-1 align-items-center">
          <label for="address">ご住所</label>
          <input type="text" class="ml-3-1 form-control" id="address" v-model="address" >
        </div>

        <div class="form-group d-flex-1 align-items-center">
          <label for="post">郵便番号<span class="pass">（ハイフンなし）</span></label>
          <input type="number" class="ml-3-1 form-control" id="post" v-model="post" >
        </div>

        <div class="form-group d-flex-1 align-items-center">
          <label for="password">パスワード <span class="pass"> (マイページログイン時に必要となります。)</span></label>
          <input type="password" class="ml-3-1 form-control" id="password" v-model="password" >
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
          <button class="mt-2 btn background-main" @click="submit()">入力内容を確認する</button>
        </div>
      </div>
    </div>






    <vFooter></vFooter>
  </div>

</template>

<script>
    import Vue from 'vue';
    import {
        registerMember
    } from '../api/user';

    export default Vue.extend({
        data() {
            return {
                id: this.$route.params.id,
                email: null,
                surname: null,
                name: null,
                full_name: null,
                mobile: null,
                address: null,
                post: null,
                password: null,
                accept: false
            };
        },

        created(){
            this.full_name = localStorage.getItem("sougi-user-name" + this.id);
            let split = this.full_name.split("_");
            this.name = split[0];
            this.surname = split[1];
        },

        methods: {
            onFileChange(e) {
                this.file = e.target.files[0];
                this.url = URL.createObjectURL(this.file);
            },
            submit() {
                if(this.accept == false) {
                    return ;
                }
                let data = new FormData();
                data.append('id', this.id);
                data.append('name', this.full_name);
                data.append('email', this.email);
                data.append('user_id', localStorage.getItem("sougi-user-id" + this.id));
                data.append('address', this.address);
                data.append('post', this.post);
                data.append('mobile', this.mobile);
                data.append('password', this.password);
                registerMember(data).then(response => {
                    let result = response.data;
                    if(result.status == true) {
                        let member_id = result.id;
                        localStorage.setItem("sougi-member-id" + this.id, member_id);
                        this.$router.push({
                            path: '/bkeeping/' + this.id
                        });
                    } else {
                        console.log("Error");
                    }
                });

            }
        }
    });

</script>

<style>


</style>
