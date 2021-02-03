<template>
  <div v-if="this.$route.path == '/'">
    <b-img
      src="../../assets/Banner.png"
      fluid-grow
      alt="Bug-Free-Disco"
    />
  </div>
</template>

<script>
export default {
  name: 'Banner'
}
</script>
