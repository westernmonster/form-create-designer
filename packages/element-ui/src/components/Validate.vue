<template>
    <div class="_fd-validate">
        <template v-for="(item, idx) in validate">
            <div class="_fd-validate-item">
                <div class="_fd-validate-title">
                    <div>
                        <span>{{ idx + 1 }}</span>
                        {{ modes[item.mode] }}
                    </div>
                    <i class="fc-icon icon-delete2" @click="remove(idx)"></i>
                </div>
                <n-grid :cols="24" :x-gap="12">
                    <n-grid-item :span="getSpan(item)">
                        <n-form-item :label="t('validate.mode')">
                            <n-select v-model:value="item.trigger" :options="triggers" @update:value="onInput" />
                        </n-form-item>
                    </n-grid-item>
                    <n-grid-item :span="getSpan(item)">
                        <n-form-item :label="modes[item.mode]">
                            <template v-if="item.mode === 'pattern'">
                                <n-input v-model:value="item[item.mode]" @update:value="onInput" />
                            </template>
                            <template v-else-if="item.mode === 'validator'">
                                <FnInput v-model="item[item.mode]" name="name" :args="['rule', 'value', 'callback']"
                                </FnInput>
                            </template>
                            <template v-else>
                                <n-input-number v-model:value="item[item.mode]" @update:value="onInput" style="width: 100%" />
                            </template>
                        </n-form-item>
                    </n-grid-item>
                    <n-grid-item :span="24">
                        <n-form-item :label="t('validate.message')">
                            <LanguageInput v-model="item.message" :placeholder="t('validate.requiredPlaceholder')"
                                           @change="onInput">
                            </LanguageInput>
                        </n-form-item>
                    </n-grid-item>
                </n-grid>
            </div>
        </template>

        <n-dropdown trigger="click" :options="modeOptions" @select="handleCommand">
            <template #trigger>
                <n-button type="primary" size="small">
                    <i class="fc-icon icon-add"></i>
                    {{ t('validate.add') }}
                </n-button>
            </template>
        </n-dropdown>
    </div>
</template>

<script>
import {defineComponent} from 'vue';
import {localeOptions} from '../utils';
import FnInput from './FnInput.vue';
import {deepCopy} from '@form-create/utils/lib/deepextend';
import LanguageInput from './language/LanguageInput.vue';
import {NGrid, NGridItem, NFormItem, NSelect, NInput, NInputNumber, NDropdown, NButton} from 'naive-ui';

export default defineComponent({
    name: 'Validate',
    inject: ['designer'],
    emits: ['update:modelValue'],
    props: {
        modelValue: Array,
    },
    components: {
        LanguageInput,
        FnInput,
        NGrid,
        NGridItem,
        NFormItem,
        NSelect,
        NInput,
        NInputNumber,
        NDropdown,
        NButton
    },
    watch: {
        modelValue(n) {
            this.validate = this.parseValue(n || []);
        }
    },
    data() {
        return {
            validate: this.parseValue(this.modelValue || []),
        };
    },
    computed: {
        t() {
            return this.designer.setupState.t;
        },
        modes() {
            const activeRule = this.designer.setupState.activeRule;
            if (activeRule && activeRule._menu.subForm === 'object') {
                return {
                    validator: this.t('validate.modes.validator'),
                }
            } else {
                return {
                    min: this.t('validate.modes.min'),
                    max: this.t('validate.modes.max'),
                    len: this.t('validate.modes.len'),
                    pattern: this.t('validate.modes.pattern'),
                    validator: this.t('validate.modes.validator'),
                }
            }
        },
        triggers() {
            return localeOptions(this.t, [
                {label: 'blur', value: 'blur'},
                {label: 'change', value: 'change'},
                {label: 'submit', value: 'submit'},
            ]);
        },
        modeOptions() {
            return Object.entries(this.modes).map(([value, label]) => ({
                label,
                key: value
            }));
        }
    },
    methods: {
        handleCommand(key) {
            this.validate.push({
                transform: new Function('val', 'this.type = val == null ? \'string\' : (Array.isArray(val) ? \'array\' : (typeof val)); return val;'),
                mode: key,
                trigger: 'blur'
            });
            this.onInput();
        },
        autoMessage(item) {
            const title = this.designer.setupState.activeRule.title;
            if (this.designer.setupState.activeRule) {
                item.message = this.t('validate.autoRequired', {title})
                this.onInput();
            }
        },
        getSpan(item) {
            return ['pattern', 'validator', 'required'].indexOf(item.mode) > -1 ? 24 : 12;
        },
        onInput: function () {
            this.$emit('update:modelValue', this.validate.map(item => {
                item = {...item};
                if (!item.message) {
                    delete item.message;
                }
                return item;
            }));
        },
        remove(idx) {
            this.validate.splice(idx, 1);
            this.onInput();
        },
        parseValue(val) {
            return deepCopy(val.map(v => {
                if (v.validator) {
                    v.mode = 'validator';
                }
                if (!v.mode) {
                    Object.keys(v).forEach(k => {
                        if (['message', 'type', 'trigger', 'mode'].indexOf(k) < 0) {
                            v.mode = k;
                        }
                    });
                }
                return v;
            }));
        }
    }
});
</script>

<style>

._fd-validate {
    display: flex;
    flex-direction: column;
    width: 100%;
}

._fd-validate-btn {
    font-weight: 400;
    width: 100%;
    border-color: #2E73FF;
    color: #2E73FF;
}

._fd-validate-item {
    border-bottom: 1px dashed #ECECEC;
    margin-bottom: 10px;
}

._fd-validate-item .n-input-number {
    width: 100%;
}

._fd-validate-title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 10px;
}

._fd-validate-title > div {
    display: flex;
    align-items: center;
}

._fd-validate-title > div > span {
    width: 16px;
    height: 16px;
    background: #ECECEC;
    text-align: center;
    font-size: 12px;
    line-height: 16px;
    border-radius: 15px;
    margin-right: 5px;
}

._fd-validate-title i {
    cursor: pointer;
}

._fd-validate-title i:hover {
    color: #FF2E2E;
}

._fd-validate .append-msg {
    cursor: pointer;
}

</style>