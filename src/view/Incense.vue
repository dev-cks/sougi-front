<template>
  <div>
    <vNavigation ></vNavigation>
    <div>
      <div>
        <p><span class="mypage-firstname">{{name}}</span>様</p>
      </div>

      <div>
        <p>{{company_name}}が喪主様に<br>
          代わりご香典をお預かり<br>
          いたします。</p>
      </div>

      <div>
        <p>また、お花やご弔電などのご依頼も承ります。</p>
      </div>
      <hr>
      <h5>ご香典のお預け、ご弔花の発注など承ります。</h5>
      <div class="payment">
        <div class="custom-group mb-2">
          <label class="text-yellow mb-1 title">ご香典</label>
          <div class="d-flex align-items-center">
            <input type="text" class="form-control form-input-control w-25 " style="text-align: center" v-model="payment"><span class="ml-2">円</span>
          </div>
          <div class="invalid-feedback d-block">
            <span v-if="invalidPayment">1000円未満でのご香典決済はできません。</span>
            <span v-else>&nbsp;</span>
          </div>

        </div>

        <div class="custom-group mb-2 d-flex align-items-center">
          <label class="title mb-0">ご香典返しの可否を選択</label>
          <b-form-radio-group name="v_radius" class="ml-5" v-model="receive_product">
            <div class="d-flex align-items-center"><p style="width: 220px;">ご香典返しをお受けします。</p><b-form-radio value="1"></b-form-radio></div>
            <div class="d-flex align-items-center"><p style="width: 220px;">ご香典返しを辞退します。</p><b-form-radio value="0"></b-form-radio></div>

          </b-form-radio-group>
        </div>
      </div>

      <div action="" class="">
        <div class="form-side w-100" >
          <div>
            <hr>
            <div class="row flex-grow-1 mt-2">
              <div class="col-12">
                <div class="product_group mb-3" v-for="group in productsGroup" :key="group.id">
                  <h5 class="text-center mb-3" style="border:1px solid darkgrey;padding: 5px 0">商品カテゴリ：{{group.name}}</h5>

                  <div class="mb-3 detail" v-for="product in group.items" :key="product.id">

                    <div class="d-flex">
                      <div class="product-image mr-3">
                        <img :src="product.img" alt="no_img" style="cursor:pointer;width: 200px; height: 180px; object-fit: contain" @click="zoom(product.img)">
                      </div>

                      <div class="product_info">
                        <div style="height: 180px">
                          <h6 class="text-left font-weight-bold">{{product.name}} {{product.cost}}円(税込)</h6>
                          <p class="text-left elliipsis-text">{{product.note}}</p>
                        </div>
                        <div class="align-items-center mt-1">
                          <label class="form-group has-float-label d-flex align-items-center">
                            <span>注文数</span>
                            <input type="number" class="ml-2 form-control" style="width: 80px;text-align: center" v-model="product.count" @change="changeProductCount" min="0">

                          </label>
                        </div>

                      </div>
                    </div>




                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="d-flex align-items-center">
          <span class="mr-3">合計額</span>
          <input disabled class="w-50 text-center" v-model="total_product_payment_str"/>
          <span class="mx-3">円</span>
          <input type="submit" class="flex-1 btn background-main" value="決定する" @click="send">
        </div>
        <p>決済後に登録携帯電話へのショートメールにて視聴方法を御案内いたします。</p>


      </div>

      <button  class="mt-3 login btn" @click="moveLive()">
        葬儀を視聴する
      </button>

    </div>







    <vFooter></vFooter>

    <Modal
      ref="imageModal"
      v-if="isModalVisible"
      :image="image_link" :title=title
      @close="closeModal"
    />
  </div>

</template>

<script>
    import Vue from 'vue';
    import {
        API_BASE, ADMIN_BASE, KEY_MEMBER_ID
    } from '../config/constants';
    import {getCookie} from '../util/support';
    import {KEY_USER_NAME} from '../config/constants';
    import Modal from '../view/Lib/ImageViewModal';

    export default Vue.extend({
        data() {
            return {
                id: this.$route.params.id,
                name: null,
                company_name: '',
                flower_name: '',
                flower_cost: 0,
                connection: null,
                loader: null,
                productsGroup: [],
                isModalVisible:false,
                title:"商品画像",
                image_link:null,
                payment: 0,
                receive_product: 1,
                total_product_payment: 0,
                total_product_payment_str: "0　自動計算　",
                invalidPayment: false
            };
        },

        components: {
            Modal
        },

        created(){
            console.log(this.id);
            let name = getCookie(KEY_USER_NAME + this.id);
            this.name = name.replace('-', ' ');

            this.connection = new WebSocket(API_BASE);
            let ref = this;
            this.connection.onmessage = function(event) {
                ref.loader.hide();
                let data = JSON.parse(event.data);
                if(data.status == true) {
                    if(data.type == 'get_product') {
                        ref.updateProductData(data.detail);
                    } else if(data.type == 'send_money'){
                        ref.$router.push({
                            path: '/user-info/',
                        });

                    } else {
                        ref.updateData(data.content);
                        ref.getProductInfo();
                    }

                }
            };
            this.connection.onopen = function(event) {
                ref.getProductInfo();
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
            updateData(data) {
                this.company_name = data.company_name;
                this.flower_name = data.flower_name;
                this.flower_cost = data.sell_price;
            },
            updateProductData(data) {
              let products = data;
              this.productsGroup = [];
              if(products.length>0){
                  let g_type = products[0].type;
                  let g_id = 1;
                  let g_items = [];
                  let single_product = products[0];
                  single_product.img = `${ADMIN_BASE}/`+single_product.img;
                  single_product.cost = parseInt(single_product.cost*110)/100;
                  single_product.count = 0;
                  g_items.push(single_product);


                  for(let k=1;k<products.length;k++){
                      let p_type = products[k].type;
                      single_product = products[k];
                      single_product.img = `${ADMIN_BASE}/`+single_product.img;
                      single_product.cost = parseInt(single_product.cost*110)/100;
                      single_product.count = 0;
                      if(g_type==p_type){
                          g_items.push(single_product)
                      }else{
                          this.productsGroup.push({
                              id:g_id,
                              items: g_items,
                              name:g_type
                          })
                          g_id++;
                          g_items = [];
                          g_items.push(single_product);
                          g_type = p_type;
                      }

                  }
                  this.productsGroup.push({
                      id:g_id,
                      items: g_items,
                      name:g_type
                  })
              }
            },
            zoom(url){

                this.image_link = url;
                this.isModalVisible = true;
            },
            closeModal() {
                this.isModalVisible = false;
            },
            getFuneralInfo() {
                let id = this.$route.params.id;
                let data = {
                    id: id
                };
                this.connection.send(JSON.stringify({
                    type: 'api',
                    method: 'funeral',
                    path: 'get_incense',
                    body: data
                }));
                this.createLoader();
            },
            getProductInfo() {
                let id = this.$route.params.id;
                let data = {
                    id: id
                };
                this.connection.send(JSON.stringify({
                    type: 'api',
                    method: 'funeral',
                    path: 'get_product',
                    body: data
                }));
                this.createLoader();
            },
            changeProductCount() {
                this.total_product_payment = 0;
                for(var i = 0; i < this.productsGroup.length; i ++) {
                    let items = this.productsGroup[i].items;
                    for(var j = 0; j < items.length; j ++) {
                        this.total_product_payment = this.total_product_payment + items[j].cost * items[j].count;
                    }
                }
                this.total_product_payment_str = this.total_product_payment + "　自動計算";
            },
            send() {
                if(this.total_product_payment == 0 && this.payment < 1000) {
                    this.invalidPayment = true;
                    return ;
                }
                let id = this.$route.params.id;
                let member = getCookie(KEY_MEMBER_ID + id);
                let products = [];
                for(var i = 0; i < this.productsGroup.length; i ++) {
                    for(var j = 0; j < this.productsGroup[i].items.length; j ++) {
                        products.push(this.productsGroup[i].items[j]);
                    }
                }
                let data = {
                    id: id,
                    member_id: member,
                    products: products,
                    payment: this.payment,
                    status: this.receive_product
                };
                console.log(data);
                this.connection.send(JSON.stringify({
                    type: 'api',
                    method: 'user',
                    path: 'send_money',
                    body: data
                }));
                this.createLoader();
            },
            moveLive() {
                this.$router.push({
                    path: `/live/stream/${this.id}`,
                });
            },

            moveNext() {

            }
        }
    });

</script>

<style>
  input[type='checkbox'] {
    margin-right: 1rem;
  }

  #money {
    text-align: right;
    width: 80px;
  }

  .product_group {
    background-color: #fff4f4;
    padding: 10px 5px;
    border-radius: 10px;
  }
  .product_group .detail {
    border-bottom: 1px solid lightgrey;
  }
  .product_group .detail:last-child {
    border-bottom: 0;
  }
  .product_list {
    display: inline;
  }
  .product_detail{
    width: 190px;
    display: inline-block;
    vertical-align: top;
  }

  .product_content {
    border-radius: 5px;
    background-color: #58ff8c;
    padding: 10px;
  }

  .product_content .description {
    word-break: break-word;
    height: 48px;
    overflow: hidden;
  }

  .payment {
    border-radius: 5px;
    background-color: #FFFF00;
    padding: 10px;
  }

  .title {
    font-weight: bold;
    font-size: 16px;
  }

  .elliipsis-text{
    display: -webkit-box;
    max-width: 100%;
    margin: 0 auto;
    font-size: 14px;
    line-height: 1.3;
    -webkit-line-clamp: 9;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: pre-line;
  }


</style>
