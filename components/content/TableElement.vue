<template>
  <table>
    <tbody>
    <tr v-for="row in content.content">
      <td v-for="text in row">{{ text }}</td>
    </tr>
    </tbody>
  </table>
</template>

<script>
    export default {
        props: ['content'],
    };
</script>

<style lang="scss" scoped>
  table {
    width: 100%;
    border-collapse: collapse;
  }

  tr:nth-child(2n) td {
    background: $main-bg;
  }

  td {
    border: 1px solid $main-light;
    padding: 0.4rem;
  }
</style>
