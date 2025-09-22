<template>
    <div class="_fd-size-input">
        <template v-if="unit[idx] === 'auto'">
            <n-button :size="size" style="width: 150px;" @click="changeType()">{{ unit[idx] }}</n-button>
        </template>
        <template v-else>
            <div style="display: flex; align-items: center; gap: 4px;">
                <n-input-number :size="size" v-model:value="num" @update:value="submit" button-placement="right"/>
                <n-dropdown :options="dropdownOptions" @select="changeType" trigger="click" :size="size">
                    <n-button :size="size">{{ unit[idx] }}</n-button>
                </n-dropdown>
            </div>
        </template>
    </div>
</template>

<script>
import {defineComponent} from 'vue';
import {isNull} from '../../utils/index';
import {NButton, NInputNumber, NDropdown} from 'naive-ui';

export default defineComponent({
    name: 'SizeInput',
    components: {NButton, NInputNumber, NDropdown},
    inject: ['designer'],
    emits: ['update:modelValue', 'change'],
    props: {
        modelValue: String,
        size: String,
        unit: {
            type: Array,
            default: () => ['auto', 'px', '%', 'vh', 'vw', 'em', 'rem']
        },
        defaultUnit: {
            type: String,
            default: 'px'
        }
    },
    watch: {
        modelValue() {
            this.parseValue();
        }
    },
    computed: {
        dropdownOptions() {
            return this.unit.map((name, idx) => ({
                label: name,
                key: idx
            }));
        }
    },
    data() {
        return {
            idx: 1,
            num: 0,
            oldValue: this.modelValue || '',
        }
    },
    methods: {
        parseValue() {
            if (this.modelValue !== 'auto') {
                this.idx = Math.max(this.unit.indexOf(this.defaultUnit), 0);
                this.unit.forEach((v, i) => {
                    if ((this.modelValue || '').indexOf(v) > -1) {
                        this.idx = i;
                    }
                });
                this.num = isNull(this.modelValue) ? null : parseFloat(this.modelValue || 0);
            } else {
                this.idx = 0;
                this.num = 0;
            }
        },
        submit() {
            this.oldValue = !isNull(this.num) ? '' + this.num + this.unit[this.idx] : '';
            this.$emit('update:modelValue', this.oldValue);
            this.$emit('change', this.oldValue);
        },
        changeType(idx) {
            if (idx !== undefined) {
                if (this.idx === idx) {
                    return;
                }
                this.idx = idx;
            } else {
                this.idx++;
                if (this.idx > 4) {
                    this.idx = 0;
                }
            }
            if (this.unit[this.idx] === 'auto') {
                this.oldValue = 'auto';
                this.$emit('update:modelValue', 'auto');
                this.$emit('change', 'auto');
            } else {
                this.submit();
            }
        },
    },
    created() {
        this.parseValue();
    }

});
</script>

<style>
._fd-size-input {
    display: flex;
    align-items: center;
}

._fd-size-input .n-input-number {
    width: 122px;
}

._fd-size-input .n-button {
    font-size: 12px;
    padding: 5px;
    margin-left: 3px;
    width: 25px;
}
</style>
