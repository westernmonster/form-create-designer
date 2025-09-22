<template>
    <ConfigItem :label="t('style.font.name')">
        <div class="_fd-fi-box" :style="fontStyle">
        </div>
        <template #append>
            <div class="_fd-font-input">
                <n-form label- label-placement="top" inline size="small">
                    <n-form-item :label="t('style.font.family')">
                        <n-select v-model:value="fontStyle.fontFamily" clearable @update:value="onInput" :options="familyTypeOptions">
                            <template #option="{ node, option }">
                                <span :style="{fontFamily: option.value}">{{ option.label }}</span>
                            </template>
                        </n-select>
                    </n-form-item>
                    <n-form-item :label="t('style.font.size')">
                        <SizeInput v-model="fontStyle.fontSize" @change="onInput"/>
                    </n-form-item>
                    <n-form-item :label="t('style.weight.name')">
                        <n-select v-model:value="fontStyle.fontWeight" clearable @update:value="onInput" :options="weightTypeOptions">
                            <template #option="{ node, option }">
                                <span :style="{fontWeight: option.value}">{{ option.label }}</span>
                            </template>
                        </n-select>
                    </n-form-item>
                    <n-form-item :label="t('style.decoration.name')">
                        <n-select v-model:value="fontStyle.textDecoration" clearable @update:value="onInput" :options="decorationTypeOptions">
                            <template #option="{ node, option }">
                                <span :style="{textDecoration: option.value}">{{ option.label }}</span>
                            </template>
                        </n-select>
                    </n-form-item>
                    <n-form-item :label="t('style.font.align')">
                        <n-select v-model:value="fontStyle.textAlign" clearable @update:value="onInput" :options="alignTypeOptions"/>
                    </n-form-item>
                    <n-form-item :label="t('style.font.height')">
                        <SizeInput v-model="fontStyle.lineHeight" @change="onInput"/>
                    </n-form-item>
                    <n-form-item :label="t('style.font.spacing')">
                        <SizeInput v-model="fontStyle.letterSpacing" @change="onInput"/>
                    </n-form-item>
                </n-form>
            </div>
        </template>
    </ConfigItem>
</template>

<script>
import {defineComponent} from 'vue';
import SizeInput from './SizeInput.vue';
import ColorInput from './ColorInput.vue';
import ConfigItem from './ConfigItem.vue';
import {toLine} from '@form-create/utils';
import {NForm, NFormItem, NSelect} from 'naive-ui';

export default defineComponent({
    name: 'FontInput',
    components: {ColorInput, SizeInput, ConfigItem, NForm, NFormItem, NSelect},
    inject: ['designer'],
    emits: ['update:modelValue', 'change'],
    props: {
        modelValue: {
            type: Object,
            default: () => ({}),
        }
    },
    watch: {
        modelValue() {
            this.tidyValue();
        }
    },
    computed: {
        borderStyleStr() {
            let str = '';
            Object.keys(this.borderStyle).forEach((key) => {
                if (this.borderStyle[key] !== '') {
                    str += toLine(key) + ': ' + this.borderStyle[key] + ';';
                }
            }, {})
            return str;
        },
        alignType() {
            return ['left', 'center', 'right'].map(v => {
                return {label: this.t('props.' + v), value: v};
            })
        },
        decorationType() {
            return ['underline', 'line-through', 'overline'].map(v => {
                return {label: this.t('style.decoration.' + v), value: v};
            });
        },
        weightType() {
            return [300, 400, 500, 700].map(v => {
                return {label: this.t('style.weight.' + v), value: v};
            });
        },
        familyType() {
            const fontFamily = this.designer.setupState.getConfig('fontFamily') || ['Microsoft YaHei', 'SimSun', 'SimHei', 'KaiTi', 'FangSong', 'Arial', 'sans-serif', 'monospace'];
            return fontFamily.map(v => {
                if (typeof v === 'string') {
                    return {label: this.t('style.family.' + v) || v, value: v};
                } else {
                    return v;
                }
            });
        },
        familyTypeOptions() {
            return this.familyType;
        },
        weightTypeOptions() {
            return this.weightType;
        },
        decorationTypeOptions() {
            return this.decorationType;
        },
        alignTypeOptions() {
            return this.alignType;
        },
    },
    data() {
        const t = this.designer.setupState.t;
        return {
            t,
            fontStyle: {
                fontSize: '',
                fontFamily: '',
                fontWeight: '',
                fontStyle: '',
                textDecoration: '',
                textAlign: '',
                lineHeight: '',
                letterSpacing: '',
            },
        }
    },
    methods: {
        tidyValue() {
            Object.keys(this.fontStyle).forEach(k => {
                this.fontStyle[k] = this.modelValue[k] || '';
            });
        },
        onInput() {
            const style = Object.keys(this.fontStyle).reduce((acc, key) => {
                if (this.fontStyle[key] !== '') {
                    acc[key] = this.fontStyle[key]
                }
                return acc
            }, {})
            this.$emit('update:modelValue', style)
            this.$emit('change', style)
        },
    },
    created() {
        this.tidyValue();
    }

});
</script>

<style>
._fd-font-input {
    display: flex;
    justify-content: center;
    padding: 0 5px;
}

._fd-fi-box {
    width: 150px;
    overflow: hidden;
}

._fd-font-input .n-form {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    width: 100%;
    grid-column-gap: 10px;
}

._fd-font-input .n-form--inline .n-form-item {
    margin: 0;
    padding: 0;
}

._fd-font-input ._fd-size-input .n-input-number {
    width: 100%;
}

</style>
