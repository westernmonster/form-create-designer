<template>
    <div class="_fd-tree-opt">
        <n-tree
            :data="value"
            key-field="index"
            :expand-on-click="false">
            <template #default="{ option: data, node }">
                <div class="_fd-tree-opt-node">
                    <n-input
                        class="_fd-tree-opt-first"
                        v-model:value="data[overColumns.label]"
                        :disabled="disabled"
                        @blur="change"
                        size="small"
                    />
                    <div class="_fd-tree-opt-last">
                        <ValueInput
                            v-model="data[overColumns.value]"
                            @blur="change"
                            :disabled="disabled"
                            @change-type="change"
                        />
                        <div v-if="!disabled" class="_fd-tree-opt-actions">
                            <div class="_fd-tree-opt-btn" @click="add(node, data)">
                                <i class="fc-icon icon-add"></i>
                            </div>
                            <div class="_fd-tree-opt-btn" @click="append(data)">
                                <i class="fc-icon icon-add-child"></i>
                            </div>
                            <div class="_fd-tree-opt-btn _fd-tree-opt-danger" @click="remove(node, data)">
                                <i class="fc-icon icon-delete"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </n-tree>
    </div>
</template>

<script>

import {defineComponent} from 'vue';
import {deepCopy} from '@form-create/utils/lib/deepextend';
import {NTree, NInput} from 'naive-ui';
import ValueInput from './ValueInput.vue';

export default defineComponent({
    name: 'TreeOptions',
    emits: ['update:modelValue'],
    components: {
        ValueInput,
        NTree,
        NInput
    },
    props: {
        modelValue: Array,
        columns: Object,
        disabled: Boolean,
    },
    inject: ['designer'],
    data() {
        return {
            value: [...deepCopy(this.modelValue || [])],
        };
    },
    computed: {
        t() {
            return this.designer.setupState.t;
        },
        overColumns() {
            if (!this.columns) {
                return {
                    label: 'label',
                    value: 'value',
                };
            }
            return {
                label: this.columns.label || 'label',
                value: this.columns.value || 'value',
            }
        }
    },
    created() {
        if (!this.value.length) {
            this.value = [{}]
        }
    },
    methods: {
        tidyValue() {
            return deepCopy(this.value);
        },
        change() {
            this.$emit('update:modelValue', this.tidyValue());
        },
        add(node) {
            const parent = node.parent;
            const children = parent.data.children || parent.data;
            children.push({});
        },
        append(data) {
            if (!data.children) {
                data.children = [];
            }
            data.children.push({});
        },
        remove(node, data) {
            const parent = node.parent;
            if (parent.data.children) {
                parent.data.children.splice(parent.data.children.indexOf(data), 1);
                if (!parent.data.children.length) {
                    delete parent.data.children;
                }
            } else {
                parent.data.splice(parent.data.indexOf(data), 1);
            }
            this.change();
        },
    }
});
</script>

<style>
._fd-tree-opt-node {
    display: flex;
    align-items: center;
    width: 100%;
}

._fd-tree-opt-first {
    width: 60px;
    margin-right: 5px;
}

._fd-tree-opt-last {
    width: 165px;
    display: flex;
    align-items: center;
}

._fd-tree-opt-actions {
    display: flex;
    margin-left: 5px;
}

._fd-tree-opt-btn {
    height: 20px;
    width: 20px;
    color: #fff;
    text-align: center;
    line-height: 20px;
    cursor: pointer;
    background-color: #2f73ff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
}

._fd-tree-opt-btn:first-child {
    border-radius: 2px 0 0 2px;
}

._fd-tree-opt-btn:last-child {
    border-radius: 0 2px 2px 0;
}

._fd-tree-opt-danger {
    background-color: #ff2d2e;
}

._fd-tree-opt .n-tree-node {
    margin-bottom: 3px;
}

._fd-tree-opt .n-tree-node-content {
    height: auto;
    padding: 2px 0;
}
</style>
