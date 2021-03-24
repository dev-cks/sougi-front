<template>
  <div>
    <vNavigation ref="navigation"></vNavigation>
<!--    <section id="hero">-->
<!--      <div id="hero-txt">-->
<!--        <p>Webライブシステムによるお葬式でネットで参列できます。</p>-->
<!--      </div>-->
<!--    </section>-->

    <section id="huhou">
      <div class="mt-2">
        <p>故　{{funeralInfo.name}}　氏のご案内</p>

        <p class="mt-1"><span class="text-gray">故人ご逝去にあたり、</span>謹んでお悔やみ申し上げます。
        この度はコロナの影響を鑑み「オンラインでの参列/弔問窓口」をご用意致しました。</p>

        <p class="mt-1"><span class="text-gray">心から哀悼の意を表しますと共に、下記より式日程など詳細をご通知申し上げます。
        故人とのお別れにご利用くださいませ。</span></p>
      </div>

      <div class="funeral">

<!--        <div class="funeral_body mt-2" v-html="funeralInfo.note">-->
<!--        </div>-->
      </div>

      <div>
        <template v-if="status == 0 || status == 1">
          <button  class="gokicho btn" @click="moveRegister()">
<!--            受付はこちら（ご記帳）-->
            オンラインでのご参列/弔問をご希望の方はこちら

          </button>
        </template>
        <template v-if="status == 2">
          <button  class="mt-2 login btn" @click="moveNext()">
            ご記帳がお済の方

          </button>
        </template>
        <template v-if="status == 3">
          <button  class="mt-2 login btn" @click="moveLive()">
            葬儀を視聴する

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
        API_BASE
    } from '../config/constants';
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
                code: this.$route.query.code,
                connection: null,
                loader: null
            };
        },

        created(){
            //removeCookie(KEY_ALLOW_COOKIE);
            console.log(this.$route.query);
            setCookie(KEY_CURRENT_NAME, this.code);
            this.connection = new WebSocket(API_BASE);
            let ref = this;
            this.connection.onmessage = function(event) {
                ref.loader.hide();
                //this.isLoading = false;
                let data = JSON.parse(event.data);
              if(data.type == 'get_detail') {
                  if(data.status == true) {
                      ref.changeData(data);
                  }
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
            changeData(res) {
                this.funeralInfo = res.data;
                console.log(res.data);
                // this.funeralInfo.create_time = Datetimes.getymd(this.funeralInfo.create_time);
                // this.funeralInfo.start_time = Datetimes.getmdwhs(this.funeralInfo.start_time);
                // this.funeralInfo.funeral_start_time = Datetimes.getmdwhs(this.funeralInfo.funeral_start_time);
                this.getUserInfo(this.funeralInfo.id);
                let funeral_id = this.funeralInfo.id;
                let company_id = this.funeralInfo.company_id;
                setCookie(KEY_CURRENT_FUNERAL_ID, funeral_id);
                setCookie(KEY_COMPANY_ID, company_id);
                this.$refs.navigation.changeFuneral();
                this.$refs.footer.changeFuneral();
            },
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
                console.log(this.status);
            },
            getFuneralInfo(){
                let data = {
                    code: this.code
                };
                this.connection.send(JSON.stringify({
                    type: 'api',
                    method: 'funeral',
                    path: 'get_detail',
                    body: data
                }));
                this.createLoader();
            },
            moveRegister() {
                if(this.funeralInfo.id) {
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
                } else {

                }

            },
            moveNext() {
                console.log(this.funeralInfo.id);
                if(this.funeralInfo.id) {
                    let step = getCookie(KEY_REGISTER_STEP + this.funeralInfo.id);
                    if(step == REGISTER_UUID) {
                        this.$router.push({
                            path: `/bkeeping/${this.funeralInfo.id}`,
                        });
                    }
                    // if(step == REGISTER_UUID) {
                    //     this.$router.push({
                    //         path: `/complete/${this.funeralInfo.id}`,
                    //     });
                    // } else if(step == REGISTER_NEXT) {
                    //     this.$router.push({
                    //         path: `/notknowother/${this.funeralInfo.id}`,
                    //     });
                    // } else if(step == REGISTER_INFO) {
                    //     this.$router.push({
                    //         path: `/bkeeping/${this.funeralInfo.id}`,
                    //     });
                    // }
                }
            },
            moveLive() {
                if(this.funeralInfo.id) {
                    this.$router.push({
                        path: `/live/stream/${this.funeralInfo.id}`,
                    });
                }

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

  .funeral_body img {
    width: 100%;
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

  .text-gray {
    color: lightgray;
  }

  .gokicho {
    max-width : 450px !important;;
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
