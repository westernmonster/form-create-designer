<template>
    <div class="_fd-gfc">
        <n-badge type="warning" dot :show="configured">
        </n-badge>
        <n-modal class="_fd-gfc-dialog" v-model:show="visible"
                 :mask-closable="false"
                 preset="dialog"
                 style="width: 1080px">
            <template #header>
                <Warning :tooltip="t('warning.fetch')"></Warning>
            </template>
            <n-layout class="_fd-gfc-con" style="height: 450px;">
                <n-tabs default-value="first" class="_fc-tabs" style="width: 100%">
                    <n-tab-pane :tab="t('fetch.config')" name="first">
                        <DragForm v-model:api="form.api" v-model="form.formData" :rule="form.rule"
                                  :option="form.options">
                            <template #title="scope">
                                <template v-if="scope.rule.warning">
                                    <Warning :tooltip="scope.rule.warning">
                                        {{ scope.rule.title }}
                                    </Warning>
                                </template>
                                <template v-else>
                                    {{ scope.rule.title }}
                                </template>
                            </template>
                        </DragForm>
                    </n-tab-pane>
                    <n-tab-pane name="second">
                        <template #tab>
                            <Warning :tooltip="t('warning.beforeFetch')"></Warning>
                        </template>
                        <FnEditor style="height: 415px;" v-model="form.beforeFetch" name="beforeFetch"
                                  :args="['config', 'data']"
                                  ref="beforeFetch"></FnEditor>
                    </n-tab-pane>
                    <n-tab-pane name="third">
                        <template #tab>
                            <Warning :tooltip="t('warning.fetchParse')"></Warning>
                        </template>
                        <FnEditor style="height: 415px;" v-model="form.parse" name="parse"
                                  :args="[{name:'res', info: t('fetch.response')}, 'rule', 'api']"
                                  ref="parse"></FnEditor>
                    </n-tab-pane>
                    <n-tab-pane :tab="t('fetch.onError')" name="fourth">
                        <FnEditor style="height: 415px;" v-model="form.onError" name="onError"
                                  :args="['e']"
                                  ref="error"></FnEditor>
                    </n-tab-pane>
                </n-tabs>
            </n-layout>
            <template #action>
                <div>
                    <n-button type="primary" size="medium" @click="save" style="color: #2f73ff">{{
                            t('props.ok')
                        }}
                    </n-button>
                </div>
            </template>
        </n-modal>
    </div>
</template>

<script>
import {deepCopy} from '@form-create/utils/lib/deepextend';
import FnEditor from './FnEditor.vue';
import StructEditor from './StructEditor.vue';
import {defineComponent} from 'vue';
import {designerForm} from '../utils/form';
import errorMessage from '../utils/message';
import is from '@form-create/utils/lib/type';
import Warning from './Warning.vue';
import {NBadge, NButton, NModal, NLayout, NTabs, NTabPane} from 'naive-ui';

const makeRule = (t) => {
    return [
        {
            type: 'input',
            field: 'action',
            title: t('fetch.action'),
            value: '',
            props: {size: 'default'},
            validate: [{required: true, message: t('fetch.actionRequired'), trigger: 'blur'}]
        },
        {
            type: 'radio',
            field: 'method',
            title: t('fetch.method'),
            value: 'GET',
            props: {
                size: 'default'
            },
            options: [
                {label: 'GET', value: 'GET'},
                {label: 'POST', value: 'POST'},
            ],
            $required: true,
        },
        {
            type: 'radio',
            field: 'dataType',
            title: t('fetch.dataType'),
            warning: t('warning.fetchDataType'),
            value: 'json',
            props: {
                size: 'default'
            },
            options: [
                {label: 'JSON', value: 'json'},
                {label: 'FormData', value: 'formData'},
            ],
            $required: true,
        },
        {
            type: 'TableOptions',
            field: 'headers',
            title: t('fetch.headers'),
            value: {},
            props: {
                column: [{label: t('props.key'), key: 'label'}, {label: t('props.value'), key: 'value'}],
                valueType: 'object',
                size: 'default'
            },
        },
        {
            type: 'TableOptions',
            field: 'query',
            title: t('fetch.query'),
            warning: t('warning.fetchQuery'),
            value: {},
            props: {
                column: [{label: t('props.key'), key: 'label'}, {label: t('props.value'), key: 'value'}],
                valueType: 'object',
                size: 'default'
            },
        },
        {
            type: 'TableOptions',
            field: 'data',
            title: t('fetch.data'),
            warning: t('warning.fetchData'),
            value: {},
            props: {
                column: [{label: t('props.key'), key: 'label'}, {label: t('props.value'), key: 'value'}],
                valueType: 'object',
                size: 'default'
            },
        }];
}

export default defineComponent({
    name: 'FetchConfig',
    emits: ['update:modelValue'],
    props: {
        modelValue: [Object, String],
        to: String,
    },
    components: {
        Warning,
        DragForm: designerForm.$form(),
        FnEditor,
        StructEditor,
        NBadge,
        NButton,
        NModal,
        NLayout,
        NTabs,
        NTabPane
    },
    inject: ['designer'],
    data() {
        return {
            visible: false,
            value: deepCopy(this.modelValue || {}),
            form: {
                api: {},
                formData: {},
                rule: [],
                options: {
                    form: {
                        labelWidth: '90px',
                        size: 'default'
                    },
                    submitBtn: false,
                    resetBtn: false,
                }
            }
        };
    },
    computed: {
        t() {
            return this.designer.setupState.t;
        },
        configured() {
            return !is.empty(this.modelValue);
        },
    },
    watch: {
        visible(v) {
            if (v) {
                this.value = deepCopy(this.modelValue || {});
                this.active();
            }
        },
    },
    methods: {
        open() {
            this.visible = true;
        },
        active() {
            const formData = this.value;
            this.form.rule = formData.type === 'static' ? [] : makeRule(this.t);
            this.form.formData = {...formData};
            this.form.label = formData.label;
            this.form.type = formData.type;
            this.form.data = formData.data;
            this.form.dataType = formData.dataType;
            this.form.parse = formData.parse || '';
            this.form.beforeFetch = formData.beforeFetch || '';
            this.form.onError = formData.onError || '';
        },
        save() {
            this.form.api.validate().then(() => {
                const formData = {...this.form.formData};
                if ((this.$refs.parse && !this.$refs.parse.save()) || (this.$refs.beforeFetch && !this.$refs.beforeFetch.save()) || (this.$refs.error && !this.$refs.error.save())) {
                    return;
                }
                formData.parse = designerForm.parseFn(this.form.parse);
                formData.beforeFetch = designerForm.parseFn(this.form.beforeFetch);
                formData.onError = this.form.onError;
                formData.label = this.form.label;
                formData.type = this.form.type;
                formData.to = this.to || 'options';
                this.$emit('update:modelValue', formData);
                this.visible = false;
            }).catch(err => {
                console.error(err);
                errorMessage(err[Object.keys(err)[0]][0].message);
            });
        },
    },
    created() {
        this.active();
    }
});
</script>

<style>
._fd-gfc, ._fd-gfc .n-badge {
    width: 100%;
}

._fd-gfc .n-button {
    font-weight: 400;
    width: 100%;
    border-color: #2E73FF;
    color: #2E73FF;
}

._fd-gfc-dialog .n-tabs .n-tabs-nav {
    margin-bottom: 0;
}

._fd-gfc-dialog .form-create {
    margin-top: 15px;
}

._fd-gfc-con .CodeMirror {
    height: 100%;
    width: 100%;
}

._fd-gfc-con .CodeMirror-wrap pre.CodeMirror-line {
    padding-left: 20px;
}
</style>
