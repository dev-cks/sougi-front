<template>
  <div>
    <vNavigation ></vNavigation>
    <div>
      <h3>弔電定型文</h3>
      <p>定型文を以下よりお選びください。</p>
      <form action="">
        <p>
          <label>
            <input type="radio" name="teikei" value="1">ご逝去を悼み、謹んでお悔やみ申し上げます。
          </label>
        </p>
        <p>
          <label>
            <input type="radio" name="teikei" value="2">ご訃報に接し、心よりご冥福をお祈り申し上げます。
          </label>
        </p>

        <input type="submit" class="btn submit" value="決定する">

      </form>
    </div>




    <vFooter></vFooter>
  </div>

</template>

<script>
    import Vue from 'vue';

    export default Vue.extend({
        data() {
            return {

            };
        },

        created(){

        },

        methods: {
        }
    });

</script>

<style>


</style>
