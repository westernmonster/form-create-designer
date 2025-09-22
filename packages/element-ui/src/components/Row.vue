<template>
    <n-grid-item :span="24">
        <div class="_fd-row n-row" :class="{'_fc-child-empty' : !$slots.default}" v-bind="$attrs">
            <slot name="default"></slot>
        </div>
    </n-grid-item>

</template>

<script>
import {defineComponent} from 'vue';
import {NGridItem} from 'naive-ui';

export default defineComponent({
    name: 'fcRow',
    components: {
        NGridItem
    },
    mounted() {
    }

});
</script>

<style>
._fd-row {
    width: 100%;
}
</style>
