<template>
  <footer>
    <div class="container">
      <nav>
        <ul class="flex-column flex-md-row justify-content-start justify-content-md-around">
          <li >
            <a href="javascript:void(0);" @click="moveCompany()">会社案内</a>
          </li>
          <router-link  tag="li" to="/pol" exact>
            <a target="_blank">プライバシーポリシー</a>
          </router-link>
          <router-link  tag="li" to="/inquiry" exact>
            <a >問い合わせ</a>
          </router-link>
          <router-link  tag="li" to="/kiyaku" exact>
            <a target="_blank">利用規約</a>
          </router-link>
          <router-link  tag="li" to="/user-info" exact v-if="statusValue == 1">
            <a >マイページ</a>
          </router-link>
          <router-link  tag="li" to="/line" exact v-if="statusValue == 1">
            <a >LINEによるお問い合わせ</a>
          </router-link>
          <router-link  tag="li" to="/toku" exact>
            <a target="_blank">特定商取引法に基づく表記</a>
          </router-link>
        </ul>
      </nav>
    </div>
  </footer>
</template>

<script>
    import Vue from 'vue';

    export default Vue.extend({
        data() {
            return {
                statusValue: 0
            };
        },
        created() {
            this.statusValue = this.status;
            this.changeFuneral();
        },
        watch: {
            // everytime a route is changed refresh the activeUser
            '$route': 'changeFuneral'
        },
        methods: {
            changeFuneral() {
                this.statusValue = 0;
                let id = localStorage.getItem("sougi-current-funeral-id");
                console.log("Id is " + id);
                let member_id = localStorage.getItem("sougi-member-id" + id);
                console.log("Test Index is " + "sougi-member-id" + id);
                console.log(member_id);
                if(member_id && member_id != 'undefined') {
                    this.statusValue = 1;
                }
            },
            moveCompany() {
                let company_id = localStorage.getItem("sougi-current-company-id");
                this.$router.push({
                    path: '/company/' + company_id
                });
            }
        }
    });

</script>
