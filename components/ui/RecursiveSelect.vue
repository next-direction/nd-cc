<template>
  <select @change="$emit('change', $event)" ref="select" id="category-select" :value="value">
    <option v-for="option in flattened" :value="option.value" :disabled="!option.allowed">
      {{ '&nbsp'.repeat(option.level * 3) }}{{ option.text }}
    </option>
  </select>
</template>

<script>
    export default {
        props: {
            level: {
                type: Number,
                default: 0,
            },
            options: Array,
            value: String,
        },
        computed: {
            flattened () {
                return this.flatten(this.options);
            },
        },
        mounted () {
            let fallback = 0;
            let isDefaultDisabled = false;
            let isValueExisting = false;

            Array.from(this.$refs.select.children).forEach(option => {

                if (!option.disabled && 0 === fallback) {
                    fallback = option.value;
                }

                if (option.value === this.value) {
                    isValueExisting = true;

                    if (option.disabled) {
                        isDefaultDisabled = true;
                    }
                }
            });

            if (!isValueExisting || isDefaultDisabled) {
                this.$refs.select.value = fallback;
                this.$refs.select.dispatchEvent(new Event('change'));
            }
        },
        methods: {
            flatten (items) {
                let options = [];

                items.forEach((item) => {
                    options.push(item);

                    if (item.children.length) {
                        options = options.concat(this.flatten(item.children));
                    }
                });

                return options;
            },
        },
    };
</script>

<style lang="scss" scoped>

</style>
