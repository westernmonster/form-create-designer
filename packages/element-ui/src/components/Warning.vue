<template>
    <span>
        <i v-if="tooltip" class="fc-icon icon-question _fd-warning-text" :title="tooltip"></i>
    </span>
</template>

<script>
import {defineComponent} from 'vue';
import {NTooltip} from 'naive-ui';

export default defineComponent({
    name: 'Warning',
    components: {
        NTooltip
    },
    props: {
        tooltip: String,
    },
    data() {
        return {}
    },
});
</script>

<style>
._fd-warning-text {
    text-decoration: underline;
    text-decoration-style: dashed;
    cursor: help;
}
</style>
