<template>
  <div>
    <input placeholder="Search in questions"/>
    <button>
      <fa :icon="fa.faSearch"></fa>
    </button>
  </div>
</template>

<script>
    import { faSearch } from "@fortawesome/free-solid-svg-icons";

    export default {
        computed: {
            fa() {
                return {
                    faSearch
                };
            }
        }
    }
</script>

<style lang="scss" scoped>
  div {
    display: flex;
    align-items: center;
    border: 1px solid $main-color;
    border-radius: $border-radius;

    input {
      font-size: 1.1rem;
      padding: 0.5rem;
      border: none;
      background: transparent;
      border-top-left-radius: $border-radius;
      border-top-right-radius: $border-radius;
      width: 30vw;
      max-width: 30rem;
      color: $secondary-color;
    }

    button {
      background: transparent;
      border: none;
      cursor: pointer;
      font-size: 1.1rem;
      color: $main-color;
    }
  }
</style>
