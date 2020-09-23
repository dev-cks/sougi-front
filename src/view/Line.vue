<template>
  <div>
    <vNavigation ></vNavigation>
    <div>
      <h3>LINEによるお問い合わせ</h3>

      <p>よくあるご質問について、LINEで気軽にお問い合わせいただけます。</p>
      <p>LINEをお使いのお客様であれば、いつでもご利用でき、スピーディーにご確認いただけますので、ぜひご利用ください。</p>

      <p>問い合わせ番号：XXXXYYYY</p>

      <div class="line_add">
        <img src="/static/images/ja.png" alt="LINE友だち追加">
      </div>
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


</style>
