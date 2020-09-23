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
  position: fixed;
  top: 0px;
  width: 100%;
  height: 100%;

  opacity: .25;
  z-index: 1030;
  pointer-events: auto;

}

#nprogress .spinner-icon {
  width: 48px;
  height: 48px;
}

#nprogress .spinner {
  top: calc(50% - 24px);
  right: calc(50% - 24px);
}
</style>

