<template>
  <div>
    <vNavigation ></vNavigation>
    <div>
      <a class="text-underline" href="javascript:void(0);" @click="moveBack()">戻る</a>
      <h3 class="text-center">問い合わせ一覧</h3>

      <ul>
        <li>
          <dl @click="sendQuestion(1)">
            <dt><span>あなた</span>ショートメッセージが届かないのですが。</dt>
            <dd><span>運営</span>スマホの機種を教えてください。</dd>
          </dl>
        </li>
        <li>
          <dl @click="sendQuestion(2)">
            <dt><span>あなた</span>SMSが届かないのですが。</dt>
            <dd><span>運営</span>スマホの機種を教えてください。</dd>
          </dl>
        </li>
      </ul>
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
            moveBack() {
                history.back();
            },
            sendQuestion(type) {
                this.$router.push({
                    path: "/inquiry/" + type
                });
            }
        }
    });

</script>

<style>

  li {
    cursor: pointer;
  }
</style>
