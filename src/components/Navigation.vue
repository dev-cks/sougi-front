<template>
  <header>
    <div class="container">
      <a class="title" @click="moveTop()">
        <span>Webシステムによるお葬式</span>
        <h1>○○葬儀社グループ</h1>
      </a>

      <nav class="header-nav">
        <ul>
          <li  @click="moveNext()">
            <button class="btn px-3 background-main" v-if="statusValue == 1"> マイページ</button>
            <button class="btn px-3 background-main" v-if="statusValue != 1"> グイン</button>
          </li>
        </ul>
      </nav>

    </div>
  </header>
</template>

<script>
    import Vue from 'vue';
    import {getCookie} from '../util/support';
    import {KEY_CURRENT_FUNERAL_ID, KEY_CURRENT_NAME, KEY_MEMBER_ID} from '../config/constants';
    export default Vue.extend({

        data() {
            return {
              statusValue: 0
            };
        },
        created() {
            this.changeFuneral();
        },
        watch: {
            // everytime a route is changed refresh the activeUser
            '$route': 'changeFuneral'
        },
        methods: {
            changeFuneral() {
                this.statusValue = 0;
                let id = getCookie(KEY_CURRENT_FUNERAL_ID);
                if(id != undefined) {
                    let member_id = getCookie(KEY_MEMBER_ID + id);
                    if(member_id != undefined) {
                        this.statusValue = 1;
                    }
                }
            },
            moveTop() {
                let name = getCookie(KEY_CURRENT_NAME);
                this.$router.push({
                    path: '/main?code=' + name
                });
            },

            moveNext() {
                let id = getCookie(KEY_CURRENT_FUNERAL_ID);
                if(this.statusValue == 1) {
                    this.$router.push({
                        path: '/user-info/'
                    });
                } else {
                    this.$router.push({
                        path: '/login/' + id
                    });
                }
            }
        }
    });

</script>

<style scoped>
  .btn {
    width: fit-content !important;
    padding: 3px;
    font-size: 12px;
  }

  .title {
    cursor: pointer;
  }

  @media(min-width:768px) {
    .btn {
      font-size: 14px;
    }

  }
</style>
