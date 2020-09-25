<template>
  <div>
    <vNavigation ref="navigation"></vNavigation>
    <section id="hero">
      <div id="hero-txt">
        <p>Webライブシステムによるお葬式でネットで参列できます。</p>
      </div>
    </section>

    <section id="huhou">
      <div class="container funeral-info my-3 shadow">
        <div class="d-flex align-items-center">
          <div class="flex-1">お取引先各位</div>
          <div>
            <p>{{funeralInfo.create_time}}</p>
            <p class="mt-2">{{funeralInfo.company_name}}</p>
          </div>
        </div>


        <div class="py-2 text-center my-4">
          訃報
        </div>
        <p>{{funeralInfo.contents}}</p>
        <p class="text-right">敬具</p>

        <div class="pt-2 text-center my-4">
          記
        </div>

        <div class="px-4">
          <div class="row">
            <div class="col-3">通夜</div>
            <div class="col-9">{{funeralInfo.start_time}}</div>
          </div>
          <div class="row mt-3">
            <div class="col-3">葬儀</div>
            <div class="col-9">{{funeralInfo.funeral_start_time}}</div>
          </div>
          <div class="row mt-3">
            <div class="col-3">住所</div>
            <div class="col-9">
              <p>{{funeralInfo.place_name}}</p>
              <p>{{funeralInfo.place_address}}</p>
              <p>{{funeralInfo.place_mobile}}</p>
            </div>
          </div>
          <div class="row mt-3">
            <div class="col-3">喪主</div>
            <div class="col-9">{{funeralInfo.manager_name}}</div>
          </div>

          <div class="row mt-3">
            <div class="col-3">連絡先</div>
            <div class="col-9">{{funeralInfo.company_name}} {{funeralInfo.company_mobile}}</div>
          </div>
          <p class="text-right mt-3">以上</p>
        </div>
      </div>
      <div>
        <template v-if="status == 0 || status == 1">
          <button  class="gokicho btn" @click="moveRegister()">
            受付はこちら（ご記帳）
          </button>
        </template>
        <template v-if="status == 2">
          <button  class="mt-2 login btn" @click="moveNext()">
            ご記帳がお済の方
          </button>
        </template>
        <template v-if="status == 3">
          <button  class="mt-2 login btn" @click="moveLive()">
            葬儀中継に進む
          </button>
        </template>

      </div>
    </section>
    <vFooter ref="footer"></vFooter>
  </div>

</template>

<script>
    import Vue from 'vue';
    import {
        getFuneralInfo
    } from '../api/funeral';
    import Datetimes from '../util/datetimes';
    import {
        KEY_COMPANY_ID,
        KEY_CURRENT_FUNERAL_ID,
        LIVE_BASE,
        KEY_CURRENT_NAME,
        KEY_ALLOW_COOKIE,
        KEY_MEMBER_ID,
        KEY_VIEWER_ID,
        KEY_REGISTER_STEP,
        REGISTER_UUID,
        REGISTER_NEXT,
        REGISTER_FINISH,
        REGISTER_INFO
    } from '../config/constants';
    import {getCookie, setCookie, removeCookie} from '../util/support';
    import {ALLOW_COOKIE} from '../config/language';

    export default Vue.extend({
        data() {
            return {
                funeralInfo: {},
                status: 0,
                name: this.$route.query.name,
            };
        },

        created(){
            //removeCookie(KEY_ALLOW_COOKIE);
            console.log(this.$route.query);
            setCookie(KEY_CURRENT_NAME, this.name);
            this.getFuneralInfo();
        },

        methods: {
            getUserInfo(id) {
                let allow_status = getCookie(KEY_ALLOW_COOKIE);
                if(allow_status == undefined) {
                    this.status = 0;
                } else {
                    let viewer_id = getCookie(KEY_VIEWER_ID + id);
                    if(viewer_id == undefined) {
                        this.status = 1;
                    } else {
                        let member_id = getCookie(KEY_MEMBER_ID + id);
                        if(member_id != undefined) {
                            this.status = 3;
                        } else {
                            this.status = 2;
                        }
                    }


                }
            },
            getFuneralInfo(){
                let split = this.name.split("_");
                let data = {
                    surname: split[1],
                    name: split[0]
                };
                getFuneralInfo(data).then(res=>{
                    if(res.data.length > 0) {
                        this.funeralInfo = res.data[0];
                        this.funeralInfo.create_time = Datetimes.getymd(this.funeralInfo.create_time);
                        this.funeralInfo.start_time = Datetimes.getmdwhs(this.funeralInfo.start_time);
                        this.funeralInfo.funeral_start_time = Datetimes.getmdwhs(this.funeralInfo.funeral_start_time);
                        this.getUserInfo(this.funeralInfo.id);
                        let funeral_id = this.funeralInfo.id;
                        let company_id = this.funeralInfo.company_id;
                        setCookie(KEY_CURRENT_FUNERAL_ID, funeral_id);
                        setCookie(KEY_COMPANY_ID, company_id);
                        this.$refs.navigation.changeFuneral();
                        this.$refs.footer.changeFuneral();
                    } else {

                    }

                });
            },
            moveRegister() {
                if(this.status == 1) {
                    this.$router.push({
                        path: `/bkeeping-pre/${this.funeralInfo.id}`,
                    });
                } else {
                    this.$confirm(ALLOW_COOKIE).then(() => {
                        setCookie(KEY_ALLOW_COOKIE, 1);
                        this.$router.push({
                            path: `/bkeeping-pre/${this.funeralInfo.id}`,
                        });
                    });

                }

            },
            moveNext() {
                let step = getCookie(KEY_REGISTER_STEP + this.funeralInfo.id);
                if(step == REGISTER_UUID) {
                    this.$router.push({
                        path: `/complete/${this.funeralInfo.id}`,
                    });
                } else if(step == REGISTER_NEXT) {
                    this.$router.push({
                        path: `/notknowother/${this.funeralInfo.id}`,
                    });
                } else if(step == REGISTER_INFO) {
                    this.$router.push({
                        path: `/bkeeping/${this.funeralInfo.id}`,
                    });
                }

            },
            moveLive() {
                window.location.href = LIVE_BASE + '/live.html?id=' + this.funeralInfo.id;
            }
        }
    });

</script>

<style>
  .funeral-info {
    padding: 16px 8px;
    font-weight: 600;
    font-size: 12px;
  }

  .login {
    color: var(--main-color);
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
    .funeral-info {
      padding: 60px 16.6%;
      font-weight: 600;
      font-size: 24px;
    }

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
