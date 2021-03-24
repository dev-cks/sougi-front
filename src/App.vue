<template>
  <div id="app" class="container">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 80px;
}
.container {
  width: 90%;
  margin: 0 auto;
  min-width: 270px;
  max-width: 1000px;
}

:root {
  --main-color: #80579b;
}

.background-main {
  background: var(--main-color);
}

ul {
  list-style: none;
  margin-bottom: 0rem;
}
.btn:focus {
  outline: 0;
}

#nprogress {
  position: fixed !important;
  top: 0px !important;
  width: 100% !important;
  height: 100% !important;

  opacity: .25 !important;
  z-index: 1030 !important;
  pointer-events: auto !important;

}

#nprogress .spinner-icon {
  width: 48px !important;
  height: 48px !important;
}

#nprogress .spinner {
  top: calc(50% - 24px) !important;
  right: calc(50% - 24px) !important;
}

  .full-page {
    position: fixed;
    top:0;
    left: 0;
    bottom: 0;
    width: 100%;
    overflow: auto;
  }

  .full-page header {
    position: relative !important;
  }

  .child-align-center {
    display: flex;
    justify-content: center;
    align-items: center;
  }

.radio-image{
  position:relative;
  overflow:hidden;
  padding-bottom:75% !important;
}
.radio-image > img{
  height: 100%;
  object-fit: cover;
  position:absolute;
}
</style>

