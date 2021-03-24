<script>

    export default {
        name: 'modal',
        props: {
            image:{
                type: String
            },
            second_image:{
                type: String
            },
            title:{
                type: String
            }
        },
        components: {

        },

        data() {
            return {

            }
        },

        methods: {
            close() {
                this.$emit('close');
            },

        },
    };
</script>

<template>
  <div class="modal-backdrop" style="display:block;">
    <div class="modal modal-select">
      <header class="modal-header header-font" style="padding: 1rem 1.75rem">
        <slot name="header">
          <label class="text-center text-large mb-0">
            {{title}}
          </label>
          <button
            type="button"
            class="btn-close"
            @click="close"
          >
            x
          </button>
        </slot>
      </header>
      <section class="modal-body">
        <slot name="body">
          <img :src="image" alt="画像はありません" v-if="image!=null">
          <img :src="second_image" class="mt-5rm" alt="画像はありません" v-if="second_image!=null">
          <h5 class="text-center" v-if="image==null&&second_image==null">画像はありません</h5>
        </slot>
      </section>
    </div>
  </div>
</template>

<style>
  .modal-backdrop{
    position: fixed !important;
    top: 0 !important;
    bottom: 0 !important;
    left: 0 !important;
    right: 0 !important;
    background-color: rgba(0, 0, 0, 0.3) !important;
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    opacity: 1 !important;
  }
  .modal-backdrop .modal-select {
    top: calc((100% - 30rem)/2) !important;
    left: calc((100% - 40rem)/2) !important;
    background: #FFFFFF;
    box-shadow: 2px 2px 20px 1px;
    overflow-x: auto;
    display: flex;
    flex-direction: column;
    width: 40rem;
    height: 30rem;
  }

  .modal-backdrop  .modal-header,
  .modal-footer {
    padding: 15px;
    display: flex;
  }

  .modal-backdrop  .modal-header {
    border-bottom: 1px solid #eeeeee;
    justify-content: space-between;
  }

  .modal-backdrop .header-font{
    font-weight: bold;
    font-size: large;
  }

  .modal-backdrop .modal-footer {
    border-top: 1px solid #eeeeee;
    justify-content: flex-end;
  }

  .modal-backdrop .modal-body {
    position: relative;
    padding: 20px 10px;
    overflow-y: scroll;
  }

  .modal-backdrop .btn-close {
    border: none;
    font-size: 18px;
    cursor: pointer;
    font-weight: bold;
    color: #000000;
    background: transparent;
  }

  .modal-backdrop img{
    width: 100%;
  }
  .modal-backdrop .mt-5rm{
    margin-top: 5rem;
  }
</style>

