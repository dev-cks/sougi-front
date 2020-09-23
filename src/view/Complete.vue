<template>
  <div>
    <vNavigation ></vNavigation>
    <div>
      <p>ご記帳ありがとうございました。<br>
        マイページへログイン後、ご香典のお預けや弔花のご依頼が承れます。</p>

      <button  class="login btn" @click="completeProfile()">
        次に進む
      </button>
    </div>


    <vFooter></vFooter>
  </div>

</template>

<script>
    import Vue from 'vue';
    import {
        getFuneralInfo
    } from '../api/funeral';

    export default Vue.extend({
        data() {
            return {

            };
        },

        created(){

        },

        methods: {
            completeProfile() {
                let id = this.$route.params.id;
                this.$router.push({
                    path: '/notknowother/' + id
                });
            }
        }
    });

</script>

<style>


</style>
