<template>
    <n-input-group class="_fd-value-input">
        <n-select
            v-model:value="type"
            :options="typeOptions"
            style="width: 80px"
            :disabled="disabled"
        />
        <n-input
            :disabled="disabled"
            v-model:value="value"
            @blur="onBlur"
            v-bind="$attrs"
        />
        <template v-if="$slots.append">
            <slot name="append"></slot>
        </template>
    </n-input-group>
</template>

<script>
import {defineComponent} from 'vue';
import {NInputGroup, NInput, NSelect} from 'naive-ui';

export default defineComponent({
    name: 'ValueInput',
    components: {
        NInputGroup,
        NInput,
        NSelect
    },
    emits: ['update:modelValue', 'change', 'change-type', 'blur'],
    inject: ['designer'],
    props: {
        modelValue: [String, Number, Boolean],
        disabled: Boolean,
    },
    data() {
        return {
            type: '1',
            value: '',
        }
    },
    computed: {
        t() {
            return this.designer.setupState.t;
        },
        typeOptions() {
            return [
                { label: this.t('validate.types.string'), value: '1' },
                { label: this.t('validate.types.number'), value: '2' },
                { label: this.t('validate.types.boolean'), value: '3' }
            ];
        }
    },
    watch: {
        modelValue: {
            handler: function (val) {
                if (typeof val === 'number') {
                    this.type = '2';
                } else if (typeof val === 'boolean') {
                    this.type = '3';
                } else {
                    this.type = '1';
                }
                this.value = null == val ? '' : ('' + val);
            },
            immediate: true,
        },
        type() {
            this.updateValue(this.value);
            this.$emit('change-type', this.type);
        }
    },
    methods: {
        onBlur(...args) {
            if (this.value !== this.toValue(this.modelValue)) {
                this.updateValue(this.value);
            }
            this.$emit('blur', ...args);
        },
        updateValue(val) {
            const value = this.toValue(val);
            this.$emit('update:modelValue', value);
            this.$emit('change', value);
        },
        toValue(val) {
            if (this.type === '1') {
                return '' + val;
            } else if (this.type === '2') {
                return parseFloat(val) || 0;
            }
            return val === 'true';
        }
    }
});
</script>

<style>
._fd-value-input .n-input-group > .n-select {
    flex-shrink: 0;
}

._fd-value-input .n-input-group > .n-input {
    flex-grow: 1;
}
</style>
