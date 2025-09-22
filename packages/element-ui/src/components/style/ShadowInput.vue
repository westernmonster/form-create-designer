<template>
    <div class="_fd-shadow-input">
        <ConfigItem :label="t('style.shadow.name')">
            <n-input clearable v-model:value="value" class="_fd-si-input">
                <template #suffix>
                    <n-dropdown :options="dropdownOptions" @select="changeValue">
                        <i class="fc-icon icon-setting"></i>
                    </n-dropdown>
                </template>
            </n-input>
            <template #append>
                <ShadowContent v-model="value"></ShadowContent>
            </template>
        </ConfigItem>
    </div>
</template>

<script>
import {defineComponent} from 'vue';
import ShadowContent from './ShadowContent.vue';
import ConfigItem from './ConfigItem.vue';
import {NInput, NDropdown} from 'naive-ui';

export default defineComponent({
    name: 'ShadowInput',
    emits: ['update:modelValue', 'change'],
    components: {ConfigItem, ShadowContent, NInput, NDropdown},
    inject: ['designer'],
    props: {
        modelValue: String,
    },
    watch: {
        modelValue() {
            this.value = this.modelValue || '';
        },
        value(n) {
            this.$emit('update:modelValue', n);
            this.$emit('change', n);
        },
    },
    computed: {
        t() {
            return this.designer.setupState.t;
        },
        dropdownOptions() {
            return [
                {label: this.t('style.shadow.classic'), key: '3px 5px 7px 2px #CBCBCBFF'},
                {label: this.t('style.shadow.flat'), key: '4px 4px 3px -2px #E7E5E5FF'},
                {label: this.t('style.shadow.solid'), key: '1px 2px 4px 2px #979797FF'}
            ];
        }
    },
    data() {
        return {
            value: this.modelValue || ''
        }
    },
    methods: {
        changeValue(key) {
            this.value = key;
        },
    },
    created() {
    }

});
</script>

<style>
._fd-shadow-input ._fd-ci-con {
    width: 150px;
}

._fd-shadow-input :focus-visible {
    outline: 0 none;
}

._fd-si-input .n-input .n-input__suffix {
    width: 24px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

._fd-shadow-input ._fd-ci-con .fc-icon {
    cursor: pointer;
}

</style>
