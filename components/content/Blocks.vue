<template>
  <section class="content">
    <template v-for="block in blocks">
      <component :is="$options.filters.ucfirst(block.type) + 'Element'" :content="block.data"/>
    </template>
  </section>
</template>

<script>
    import CodeElement from '~/components/content/CodeElement.vue';
    import DelimiterElement from '~/components/content/DelimiterElement.vue';
    import HeaderElement from '~/components/content/HeaderElement.vue';
    import ImageElement from '~/components/content/ImageElement.vue';
    import ListElement from '~/components/content/ListElement.vue';
    import ParagraphElement from '~/components/content/ParagraphElement.vue';
    import QuoteElement from '~/components/content/QuoteElement.vue';
    import TableElement from '~/components/content/TableElement.vue';
    import WarningElement from '~/components/content/WarningElement.vue';

    export default {
        components: {
            CodeElement,
            DelimiterElement,
            HeaderElement,
            ImageElement,
            ListElement,
            ParagraphElement,
            QuoteElement,
            TableElement,
            WarningElement,
        },
        props: ['blocks'],
    };
</script>

<style lang="scss" scoped>

</style>
