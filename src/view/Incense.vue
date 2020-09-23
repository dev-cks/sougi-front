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

    </div>







    <vFooter></vFooter>
  </div>

</template>

<script>
    import Vue from 'vue';
    import {
        getFuneralIncenseInfo
    } from '../api/funeral';

    export default Vue.extend({
        data() {
            return {
                name: null,
                company_name: '',
                flower_name: '',
                flower_cost: 0
            };
        },

        created(){
            this.getFuneralInfo();
            let name = localStorage.getItem("sougi-user-name");
            this.name = name.replace('-', ' ');
        },

        methods: {
            getFuneralInfo() {
                let id = this.$route.params.id;
                let data = {
                    id: id
                };
                getFuneralIncenseInfo(data).then(response => {
                    let data = response.data[0];
                    this.company_name = data.company_name;
                    this.flower_name = data.flower_name;
                    this.flower_cost = data.sell_price;
                })
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
