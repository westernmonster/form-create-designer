<template>
    <div class="_td-table-opt">
        <n-data-table
            :data="value"
            :columns="tableColumns"
            :bordered="true"
            :size="size || 'small'"
            style="width: 100%"
        />
        <div class="_td-table-opt-handle">
            <n-button text type="primary" @click="add" v-if="!max || max > value.length">
            </n-button>
        </div>
    </div>
</template>

<script>
import {defineComponent, h} from 'vue';
import {copy} from '@form-create/utils/lib/extend';
import {NDataTable, NButton, NInput} from 'naive-ui';
import ValueInput from './ValueInput.vue';

export default defineComponent({
    name: 'TableOptions',
    emits: ['update:modelValue', 'change'],
    components: {
        ValueInput,
        NDataTable,
        NButton,
        NInput
    },
    props: {
        modelValue: [Array, Object],
        column: {
            type: Array,
            default: () => [{label: 'label', key: 'label'}, {label: 'value', key: 'value'}]
        },
        valueType: String,
        max: Number,
        size: String,
        disabled: Boolean,
    },
    inject: ['designer'],
    watch: {
        modelValue() {
            this.value = this.tidyModelValue();
        }
    },
    computed: {
        t() {
            return this.designer.setupState.t;
        },
        tableColumns() {
            const columns = this.column.map(col => ({
                title: col.label,
                key: col.key,
                render: (row, index) => {
                    if (col.value) {
                        return h(ValueInput, {
                            size: this.size || 'small',
                            modelValue: row[col.key],
                            disabled: this.disabled,
                            'onUpdate:modelValue': (n) => {
                                row[col.key] = n;
                            },
                            onBlur: () => this.onInput(row),
                            'onChange-type': () => this.onInput(row)
                        });
                    } else {
                        return h(NInput, {
                            size: this.size || 'small',
                            disabled: this.disabled,
                            value: row[col.key] || '',
                            'onUpdate:value': (n) => {
                                row[col.key] = n;
                            },
                            onBlur: () => this.onInput(row)
                        });
                    }
                }
            }));

            if (!this.disabled) {
                columns.push({
                    title: '',
                    key: 'actions',
                    width: 45,
                    align: 'center',
                    fixed: 'right',
                    render: (row, index) => {
                        return h('i', {
                            class: 'fc-icon icon-delete',
                            style: { cursor: 'pointer' },
                            onClick: () => this.del(index)
                        });
                    }
                });
            }

            return columns;
        }
    },
    data() {
        return {
            value: this.tidyModelValue(),
        };
    },
    methods: {
        tidyModelValue() {
            const modelValue = this.modelValue;
            if (this.valueType === 'string') {
                return (modelValue || []).map(value => {
                    return {value: '' + value}
                })
            } else if (this.valueType === 'object') {
                return Object.keys((modelValue || {})).map(label => {
                    return {label, value: modelValue[label]}
                })
            } else {
                return [...modelValue || []].map(v => {
                    return copy(v);
                });
            }
        },
        tidyValue() {
            if (this.valueType === 'object') {
                const obj = {};
                this.value.forEach(v => {
                    if (v.label && v.value) {
                        obj[v.label] = v.value;
                    }
                })
                return obj;
            } else {
                return this.value.map(v => {
                    if (this.valueType === 'string') {
                        return v.value;
                    }
                    return {...v}
                });
            }
        },
        onInput(item) {
            if (this.column.length === 1 && '' === item[this.column[0].key]) {
                return;
            }
            const flag = this.column.every(v => {
                if (v.required === false) {
                    return true;
                }
                if (['object', 'string'].indexOf(this.valueType) > -1) {
                    return item[v.key] !== undefined && item[v.key] !== '' && item[v.key] !== null;
                }
                return item[v.key] !== undefined;
            })
            if (flag) {
                this.input();
            }
        },
        input() {
            const value = this.tidyValue();
            this.$emit('update:modelValue', value);
            this.$emit('change', value);
        },
        add() {
            this.value.push(this.column.reduce((initial, v) => {
                initial[v.key] = '';
                return initial;
            }, {}));
        },
        del(idx) {
            this.value.splice(idx, 1);
            this.input();
        }
    }
});
</script>

<style scoped>
._td-table-opt {
    width: 100%;
}

._td-table-opt .n-data-table {
    z-index: 1;
}

._td-table-opt-handle {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 8px 5px 0 0;
}

._td-table-opt-handle .n-button {
    display: flex;
    align-items: center;
}

._td-table-opt-handle .fc-icon {
    margin-right: 4px;
}
</style>
