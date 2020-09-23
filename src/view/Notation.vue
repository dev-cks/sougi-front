<template>
  <div>
    <vNavigation ></vNavigation>
    <div>
      <a class="text-underline" href="javascript:;" onclick="window.close();" >戻る</a>

      <h3 class="text-center">特定商取引法に基づく表示</h3>

      <p>2020年7月11日作成</p>

      <dl>
        <dt>販売業者</dt>
        <dd>株式会社ゼロシステム</dd>

        <dt>所在地</dt>
        <dd>東京都千代田区平河町１－６－１５ＵＳビル８Ｆ</dd>

        <dt>電話番号</dt>
        <dd>050-5809-6470</dd>

        <dt>E-mail</dt>
        <dd>info@zerosystem.co.jdd</dd>

        <dt>URL</dt>
        <dd>httdds://zerosystem.co.jdd</dd>
      </dl>

      <dl>
        <dt>責任者</dt>
        <dd>池　高生</dd>
      </dl>

      <dl>
        <dt>販売価格</dt>
        <dd>商品個々に設定</dd>

        <dt>販売価格以外の費用</dt>
        <dd>
          パケット代等の携帯電話の利用に伴う通信費用及び電気通信回線の通信料金等(インターネット接続料金を含む)
          <p>※料金は、お客様がご契約されている通信事業者等にお問い合わせください。</p>
        </dd>

        <dt>申し込み方法</dt>
        <dd>収納代行依頼画面及び商品購入画面</dd>

        <dt>商品の引渡し時期</dt>
        <dd>
          当社の規定によります。
          <p>基本的に、購入後即発送及び収納手続きをいたします。到着しない場合は、弊社にご連絡ください。</p>
        </dd>

        <dt>商品の発送方法</dt>
        <dd>弊社指定業者</dd>

        <dt>お支払い方法</dt>
        <dd>Amazonpay、クレジットカード等</dd>

        <dt>不良品について</dt>
        <dd>不良品、または明らかに商品説明と異なる商品は返品・交換に対応致します。</dd>

        <dt>返品について</dt>
        <dd>基本的にお客様都合の返品には対応しておりません。</dd>

        <dt>販売条件</dt>
        <dd>日本国内のみ</dd>
      </dl>
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
            moveBack() {
                window.close();
                //history.back();
            }
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
