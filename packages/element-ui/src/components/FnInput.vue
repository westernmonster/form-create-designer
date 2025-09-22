<template>
    <div class="_fd-fn-input">
        <n-badge dot :show="configured" type="warning">
            <n-button @click="visible=true" size="small">
                <slot>
                    {{t('event.title')}}
                </slot>
            </n-button>
        </n-badge>
        <n-modal
            class="_fd-fn-input-dialog _fd-config-dialog"
            :title="title || t('struct.title')"
            v-model:show="visible"
            preset="dialog"
            :mask-closable="false"
            style="width: 800px;"
        >
            <FnEditor ref="editor" v-model="value" :name="name" :args="args" :body="body" :fnx="fnx"></FnEditor>
            <template #action>
                <n-space>
                </n-space>
            </template>
        </n-modal>
    </div>
</template>

<script>
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import {defineComponent} from 'vue';
import {NBadge, NButton, NModal, NSpace} from 'naive-ui';
import FnEditor from './FnEditor.vue';

export default defineComponent({
    name: 'FnInput',
    components: {
        FnEditor,
        NBadge,
        NButton,
        NModal,
        NSpace
    },
    emits: ['update:modelValue', 'change'],
    props: {
        modelValue: [String, Function],
        name: String,
        args: Array,
        title: String,
        body: Boolean,
        fnx: Boolean,
        defaultValue: {
            require: false
        },
        validate: Function,
    },
    inject: ['designer'],
    computed: {
        t() {
            return this.designer.setupState.t;
        },
        configured() {
            return !!this.modelValue;
        },
    },
    data() {
        return {
            visible: false,
            value: this.modelValue
        };
    },
    watch: {
        modelValue(n){
            this.value = n;
        }
    },
    methods: {
        onOk() {
            if(this.$refs.editor.save()) {
                this.$emit('update:modelValue', this.value);
                this.$emit('change', this.value);
                this.visible = false;
            }
        },
    }
});
</script>

<style>
._fd-fn-input {
    width: 100%;
}

._fd-fn-input .n-badge {
    width: 100%;
}

._fd-fn-input .n-button {
    font-weight: 400;
    width: 100%;
    border-color: #2E73FF;
    color: #2E73FF;
}

._fd-fn-input-dialog .CodeMirror-lint-tooltip {
    z-index: 2021 !important;
}

._fd-fn-input-dialog .n-dialog__content {
    padding: 0px;
    height: 500px;
}
</style>
