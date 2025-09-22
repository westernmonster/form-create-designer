<template>
    <div class="_fd-struct">
        <n-badge dot type="warning" :show="configured">
            <div @click="visible=true">
                <slot>
                    <n-button class="_fd-plain-button" ghost size="small">
                        {{ title || t('struct.title') }}
                    </n-button>
                </slot>
            </div>
        </n-badge>
        <n-modal class="_fd-struct-con" :title="title || t('struct.title')" v-model:show="visible" :mask-closable="false" preset="dialog" style="width: 800px">
            <div ref="editor" v-if="visible"></div>
            <template #action>
                <div>
                </div>
            </template>
        </n-modal>
    </div>
</template>

<script>
import 'codemirror/lib/codemirror.css';
import CodeMirror from 'codemirror/lib/codemirror';
import 'codemirror/mode/javascript/javascript';
import {deepParseFn, toJSON} from '../utils/index';
import {deepCopy} from '@form-create/utils/lib/deepextend';
import {defineComponent, markRaw} from 'vue';
import is from '@form-create/utils/lib/type';
import errorMessage from '../utils/message';
import beautify from 'js-beautify';
import {NBadge, NButton, NModal} from 'naive-ui';

export default defineComponent({
    name: 'Struct',
    components: {
        NBadge,
        NButton,
        NModal
    },
    emits: ['update:modelValue'],
    props: {
        modelValue: [Object, Array, Function],
        title: String,
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
            return !is.empty(this.modelValue) && Object.keys(this.modelValue).length > 0;
        },
    },
    data() {
        return {
            editor: null,
            visible: false,
            oldVal: null,
        };
    },
    watch: {
        modelValue() {
            this.load();
        },
        visible(n) {
            if (n) {
                this.load();
            }
        },
    },
    methods: {
        load() {
            const val = toJSON(deepParseFn(this.modelValue ? deepCopy(this.modelValue) : this.defaultValue));
            this.oldVal = val;
            this.$nextTick(() => {
                this.editor = markRaw(CodeMirror(this.$refs.editor, {
                    lineNumbers: true,
                    mode: 'javascript',
                    lint: true,
                    line: true,
                    tabSize: 2,
                    lineWrapping: true,
                    value: val ? beautify.js(val, {
                        indent_size: '2',
                        indent_char: ' ',
                        max_preserve_newlines: '5',
                        indent_scripts: 'separate',
                    }) : '',
                }));
            });
        },
        onOk() {
            const str = (this.editor.getValue() || '').trim();
            let val;
            try {
                val = (new Function('return ' + str))();
            } catch (e) {
                console.error(e);
                errorMessage(this.t('struct.errorMsg'));
                return false;
            }
            if (this.validate && false === this.validate(val)) {
                errorMessage(this.t('struct.errorMsg'));
                return false;
            }
            this.visible = false;
            if (toJSON(val, null, 2) !== this.oldVal) {
                this.$emit('update:modelValue', val);
            }
            return true;
        },
    }
});
</script>

<style>
._fd-struct {
    width: 100%;
}

._fd-struct .n-badge {
    width: 100%;
}

._fd-struct .n-button {
    font-weight: 400;
    width: 100%;
    border-color: #2E73FF;
    color: #2E73FF;
}

._fd-struct-con .CodeMirror {
    height: 500px;
}

._fd-struct-con .n-modal-body {
    padding: 0px;
}
</style>
