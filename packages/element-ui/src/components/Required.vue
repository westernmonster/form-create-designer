<template>
    <div class="_fd-required">
        <n-switch v-model:value="required"></n-switch>
        <LanguageInput v-model="requiredMsg" v-if="required"
                       :placeholder="t('validate.requiredPlaceholder')"></LanguageInput>
    </div>
</template>

<script>
import is from '@form-create/utils/lib/type';
import {defineComponent} from 'vue';
import LanguageInput from './language/LanguageInput.vue';
import {NSwitch} from 'naive-ui';

export default defineComponent({
    name: 'Required',
    components: {
        LanguageInput,
        NSwitch
    },
    emits: ['update:modelValue'],
    props: {
        modelValue: {}
    },
    inject: ['designer'],
    watch: {
        required() {
            this.update();
        },
        requiredMsg() {
            this.update();
        },
        modelValue(n) {
            const flag = is.String(n);
            this.required = n === undefined ? false : (flag ? true : !!n);
            this.requiredMsg = flag ? n : '';
        },
    },
    computed: {
        t() {
            return this.designer.setupState.t;
        },
    },
    data() {
        const flag = is.String(this.modelValue);
        return {
            required: this.modelValue === undefined ? false : (flag ? true : !!this.modelValue),
            requiredMsg: flag ? this.modelValue : ''
        };
    },
    methods: {
        update() {
            let val;
            if (this.required === false) {
                val = false;
            } else {
                val = this.requiredMsg || true;
            }
            this.$emit('update:modelValue', val);
        },
    }
});
</script>

<style>
._fd-required {
    display: flex;
    align-items: center;
    width: 100%;
}

._fd-required .n-input {
    margin-left: 15px;
}

._fd-required .n-switch {
    height: 28px;
}
</style>
