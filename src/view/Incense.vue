<template>
  <div>
    <vNavigation ></vNavigation>
    <div>
      <div>
        <p><span class="mypage-firstname">{{name}}</span>様</p>
      </div>

      <div>
        <p>{{company_name}}が喪主様に<br>
          代わりご香典をお預かり<br>
          いたします。</p>
      </div>

      <div>
        <p>また、お花やご弔電などのご依頼も承ります。</p>
      </div>

      <form action="" class="form">

        <p>
          <label>
            <span><input type="checkbox">ご香典</span>
            <input type="number" id="money" name="koden" placeholder="" size="3">,000円
          </label>
        <p>

        <p>
          <label>
            <span><input type="checkbox">{{flower_name}}<span class="ohana">{{flower_cost}}円</span></span>
          </label>
        <p>

        <p>
          <label>
            <span><input type="checkbox">ご弔電<span class="choden">2,000円</span></span>
          </label>
        </p>
        <label>
          <p>弔電内容<input type="button" class="ml-2 rounded" onclick="moveNext()" value="定型文"></p>
          <textarea class="mt-2" name="chodentxt" id="" cols="30" rows="10"></textarea>
        </label>
        <input type="submit" class="btn submit" value="決定する">

      </form>

      <button  class="mt-2 login btn" @click="moveLive()">
        葬儀を視聴する
      </button>

    </div>







    <vFooter></vFooter>
  </div>

</template>

<script>
    import Vue from 'vue';
    import {
        API_BASE
    } from '../config/constants';
    import {getCookie} from '../util/support';
    import {KEY_USER_NAME} from '../config/constants';

    export default Vue.extend({
        data() {
            return {
                id: this.$route.params.id,
                name: null,
                company_name: '',
                flower_name: '',
                flower_cost: 0,
                connection: null,
                loader: null
            };
        },

        created(){
            console.log(this.id);
            let name = getCookie(KEY_USER_NAME + this.id);
            this.name = name.replace('-', ' ');

            this.connection = new WebSocket(API_BASE);
            let ref = this;
            this.connection.onmessage = function(event) {
                ref.loader.hide();
                let data = JSON.parse(event.data);
                if(data.status == true) {
                    ref.updateData(data.content);
                }
            };
            this.connection.onopen = function(event) {
                ref.getFuneralInfo();
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
                this.company_name = data.company_name;
                this.flower_name = data.flower_name;
                this.flower_cost = data.sell_price;
            },
            getFuneralInfo() {
                let id = this.$route.params.id;
                let data = {
                    id: id
                };
                this.connection.send(JSON.stringify({
                    type: 'api',
                    method: 'funeral',
                    path: 'get_incense',
                    body: data
                }));
                this.createLoader();
            },
            moveLive() {
                this.$router.push({
                    path: `/live/stream/${this.id}`,
                });
            },

            moveNext() {

            }
        }
    });

</script>

<style>
  input[type='checkbox'] {
    margin-right: 1rem;
  }

  #money {
    text-align: right;
    width: 80px;
  }

</style>
