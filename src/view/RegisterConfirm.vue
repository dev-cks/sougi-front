<template>
  <div>
    <vNavigation ></vNavigation>
    <div>
      <p>入力内容</p>

      <p>
        苗字： {{surname}}
      </p>
      <p>
        名前： {{name}}
      </p>
      <p>
        メールアドレス： {{email}}
      </p>
      <p>
        お電話番号： {{mobile}}
      </p>
      <p>
        ご住所： {{address}}
      </p>
      <p>
        郵便番号： {{post}}
      </p>
      <div class="d-flex justify-content-center">
        <button class="mt-2 btn text-black" @click="moveNext()">送信する</button>
      </div>
    </div>



    <vFooter></vFooter>
  </div>

</template>

<script>
    import Vue from 'vue';
    import {
        API_BASE
    } from '../config/constants';
    import {getCookie, setCookie} from '../util/support';
    import {KEY_MEMBER_ID, KEY_MEMBER_ID_PRE, KEY_REGISTER_STEP, REGISTER_FINISH} from '../config/constants';
    export default Vue.extend({
        data() {
            return {
                id: this.$route.params.id,
                email: null,
                surname: null,
                name: null,
                mobile: null,
                address: null,
                post: null,
                connection: null,
                loader: null
            };
        },

        created(){
            this.connection = new WebSocket(API_BASE);
            let ref = this;
            this.connection.onmessage = function(event) {
                ref.loader.hide();
                let data = JSON.parse(event.data);
                  if(data.status == true) {
                      ref.updateData(data.content.user[0]);
                  }
            };
            this.connection.onopen = function(event) {
                ref.getMemberInfo();
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
            updateData(data) {
                console.log(data);
                let full_name = data.name;
                let split = full_name.split('_');
                this.name = split[0];
                this.surname = split[1];
                this.email = data.email;
                this.mobile = data.mobile;
                this.address = data.address;
                this.post = data.post;
            },
            getMemberInfo() {
                let member_id = getCookie(KEY_MEMBER_ID_PRE + this.id);
                let data = {
                    member_id: member_id
                };
                this.connection.send(JSON.stringify({
                    type: 'api',
                    method: 'user',
                    path: 'get_member',
                    body: data
                }));
                this.createLoader();

            },

            moveNext() {
                let member_id = getCookie(KEY_MEMBER_ID_PRE + this.id);
                setCookie(KEY_MEMBER_ID + this.id, member_id);
                setCookie(KEY_REGISTER_STEP + this.id, REGISTER_FINISH);
                this.$router.push({
                    path: '/incense/' + this.id
                });
            }
        }
    });

</script>

<style>
  .funeral-info {
    padding: 24px 36px;
  }

  .flex-1 {
    flex: 1;
  }

  #hero {
    height: 200px;
    background-image: url('/static/images/hero.jpg');
    background-size: cover;
    background-position: top;
    display: flex;
    align-items: center;
  }

  #hero-txt {
    width: 100%;
    height: 50px;
    background: #fff;
    opacity: 0.6;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  #hero p {
    font-size: 12px;
    color: #313131;
  }

  @media(min-width: 768px) {
    #hero {
      margin-top: 30px;
      height: 400px;
    }

    #hero-txt {
      height: 80px;
    }

    #hero p {
      font-size: 24px;
    }
  }

</style>
