<template>
  <div>
    <vNavigation ></vNavigation>
    <div>
      <h2>会社案内</h2>

      <h3 class="mt-2">葬儀運営会社</h3>

      <table v-if="company_id != 0">
        <tr>
          <td class="td0">社名</td>
          <td>{{name}}</td>
        </tr>
        <tr>
          <td class="td0">住所</td>
          <td>{{address}}</td>
        </tr>
        <tr>
          <td class="td0">連絡先</td>
          <td>{{mobile}}</td>
        </tr>
      </table>

      <div class="mt-2">
        <h3>葬儀中継会社</h3>

        <table>
          <tr>
            <td class="td0">社名</td>
            <td>株式会社ゼロシステム（ZEROSYSTEM Inc.）</td>
          </tr>
          <tr>
            <td class="td0">住所</td>
            <td>〒102-0093 東京都千代田区平河町1-6-15 USビル8F</td>
          </tr>
          <tr>
            <td class="td0">設立</td>
            <td>１９９５年（平成７年）１月２４日</td>
          </tr>
          <tr>
            <td class="td0">資本金</td>
            <td>１０００万円</td>
          </tr>
          <tr>
            <td class="td0">役員</td>
            <td>代表取締役　池高生</td>
          </tr>
          <tr>
            <td class="td0">事業内容</td>
            <td>
              <ol>
                <li>コンピュータソフトウエア開発・販売</li>
                <li>スマートフォン等アプリケーションソフトの企画開発</li>
                <li>アプリケーション開発用ＳＤＫ（システムデザインキット）の提供</li>
                <li>アプリケーションサーバシステムの開発、運営</li>
                <li>エンタテイメント系ビジネスの企画立ち上げ</li>
                <li>他、前項に関連する業務</li>
              </ol>
            </td>
          </tr>
          <tr>
            <td class="td0">連絡先</td>
            <td>info@zerosystem.co.jp</td>
          </tr>
        </table>
      </div>
    </div>

    <vFooter></vFooter>
  </div>

</template>

<script>
    import Vue from 'vue';
    import {
        API_BASE
    } from '../config/constants';

    export default Vue.extend({
        data() {
            return {
                company_id: this.$route.params.id,
                name: null,
                address: null,
                contact_name: null,
                mobile: null,
                connection: null,
                loader: null
            };
        },

        created(){
            if(this.company_id != 0) {
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
                    ref.getCompanyInfo();
                };
            }
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
                this.name = data.name;
                this.address = data.address;
                this.mobile = data.mobile;
                //this.contact_name = data.contact_name + " " + data.contact_surname;
            },
            getCompanyInfo() {
                let data = {
                    id: this.company_id
                };
                this.connection.send(JSON.stringify({
                    type: 'api',
                    method: 'company',
                    body: data
                }));
                this.createLoader();
            },
        }
    });

</script>

<style>
  .funeral-info {
    padding: 24px 36px;
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
