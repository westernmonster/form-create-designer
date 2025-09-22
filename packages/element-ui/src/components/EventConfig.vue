<template>
    <div class="_fd-event">
        <n-badge :value="eventNum" type="warning" :show="eventNum >= 1">
        </n-badge>
        <n-modal class="_fd-event-dialog" :title="t('event.title')" v-model:show="visible"
                 :mask-closable="false"
                 preset="dialog"
                 style="width: 1080px">
            <n-layout class="_fd-event-con" style="height: 600px">
                <n-layout-sider style="width: 300px;">
                    <n-layout class="_fd-event-l">
                        <n-layout-header class="_fd-event-head" style="height: 40px; padding: 5px 15px;">
                            <n-dropdown trigger="click" size="medium" placement="bottom-start" :options="createOptions" @select="handleCreateSelect">
                                <n-button text type="primary" size="medium">
                                    <i class="fc-icon icon-add"></i>
                                    {{ t('event.create') }}
                                </n-button>
                            </n-dropdown>
                        </n-layout-header>
                        <n-layout-content>
                            <div class="_fd-event-menu">
                                <template v-for="(item, name) in event" :key="name">
                                    <template v-if="Array.isArray(item)">
                                        <template v-for="(event, index) in item" :key="name + index">
                                            <div class="_fd-event-item">
                                                <div class="_fd-event-title"
                                                     @click.stop="edit({name, item, index})">
                                                    <div class="_fd-event-method">
                                                        <span>function<span>{{
                                                                name
                                                            }}</span></span>
                                                        <span class="_fd-label"
                                                              v-if="eventInfo[name]">{{ eventInfo[name] }}</span>
                                                    </div>
                                                    <i class="fc-icon icon-delete"
                                                       @click.stop="rm({name, item, index})"></i>
                                                </div>
                                            </div>
                                        </template>
                                    </template>
                                    <div class="_fd-event-item" v-else>
                                        <div class="_fd-event-title" @click.stop="edit({name})">
                                            <div class="_fd-event-method">
                                                <span>function<span>{{
                                                        name
                                                    }}</span></span>
                                                <span class="_fd-label"
                                                      v-if="eventInfo[name]">{{ eventInfo[name] }}</span>
                                            </div>
                                            <i class="fc-icon icon-delete" @click.stop="rm({name})"></i>
                                        </div>
                                    </div>
                                </template>
                                <div class="_fd-event-item" v-if="cus" style="padding-left: 10px;">
                                    <div class="_fd-event-title" @click.stop>
                                        <n-input type="text" v-model:value="cusValue" size="medium"
                                                 @keydown.enter="addCus"
                                                 :placeholder="t('event.placeholder')">
                                        </n-input>
                                        <div>
                                            <i class="fc-icon icon-add" @click.stop="addCus"></i>
                                            <i class="fc-icon icon-delete" @click.stop="closeCus"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </n-layout-content>
                    </n-layout>
                </n-layout-sider>
                <n-layout-content>
                    <n-layout class="_fd-event-r">
                        <n-layout-header class="_fd-event-head" style="height: 40px; padding: 5px 15px;" v-if="activeData">
                            <div><a target="_blank" href="https://form-create.com/v3/instance/">{{t('form.document')}}</a></div>
                            <div>
                                <n-button size="small" type="primary" @click="save" style="color: #2f73ff">{{
                                        t('props.save')
                                    }}
                                </n-button>
                            </div>
                        </n-layout-header>
                        <n-layout-content v-if="activeData">
                            <FnEditor ref="fn" v-model="eventStr" body :name="activeData.name"
                                      :args="fnArgs"
                                      style="height: 519px;"/>
                        </n-layout-content>
                    </n-layout>
                </n-layout-content>
            </n-layout>
            <template #action>
                <div>
                    <n-button type="primary" size="medium" @click="submit" style="color: #2f73ff">{{
                            t('props.ok')
                        }}
                    </n-button>
                </div>
            </template>
        </n-modal>
    </div>
</template>

<script>
import unique from '@form-create/utils/lib/unique';
import deepExtend from '@form-create/utils/lib/deepextend';
import is from '@form-create/utils/lib/type';
import {defineComponent} from 'vue';
import FnEditor from './FnEditor.vue';
import errorMessage from '../utils/message';
import {getInjectArg} from '../utils';
import {NBadge, NButton, NModal, NLayout, NLayoutSider, NLayoutHeader, NLayoutContent, NDropdown, NInput, NIcon} from 'naive-ui';

const $T = '$FNX:';

const isFNX = v => {
    return is.String(v) && v.indexOf($T) === 0;
};

export default defineComponent({
    name: 'EventConfig',
    emits: ['update:modelValue'],
    props: {
        modelValue: [Object, undefined, null],
        componentName: String,
        eventName: {
            type: Array,
            default: () => []
        }
    },
    inject: ['designer'],
    components: {
        FnEditor,
        NBadge,
        NButton,
        NModal,
        NLayout,
        NLayoutSider,
        NLayoutHeader,
        NLayoutContent,
        NDropdown,
        NInput,
        NIcon
    },
    data() {
        return {
            visible: false,
            activeData: null,
            val: null,
            defActive: 'no',
            hookList: ['hook_load', 'hook_mounted', 'hook_deleted', 'hook_watch', 'hook_value', 'hook_hidden'],
            event: {},
            cus: false,
            cusValue: '',
            eventStr: '',
        };
    },
    computed: {
        t() {
            return this.designer.setupState.t;
        },
        activeRule() {
            return this.designer.setupState.activeRule;
        },
        orgEvent() {
            if (!this.eventName || !this.eventName.length) {
                return ['click'];
            }
            return this.eventName;
        },
        eventList() {
            return this.orgEvent.map(v => {
                return typeof v === 'object' ? v.name : v;
            })
        },
        eventInfo() {
            const info = {};
            this.orgEvent.forEach(v => {
                if (typeof v === 'object') {
                    info[v.name] = this.t('com.' + this.componentName + '.event.' + v.name) || v.info || this.t('eventInfo.' + v.name) || '';
                } else {
                    info[v] = this.t('com.' + this.componentName + '.event.' + v) || this.t('eventInfo.' + v) || '';
                }
            })
            this.hookList.forEach(v => {
                info[v] = this.t('eventInfo.' + v) || '';
            })
            return info;
        },
        eventNum() {
            let num = 0;
            Object.keys(this.modelValue || {}).forEach(k => {
                num += Array.isArray(this.modelValue[k]) ? this.modelValue[k].length : 1;
            });
            const hooks = this.activeRule ? {...this.activeRule._hook || {}} : {};
            Object.keys(hooks).forEach(k => {
                num += Array.isArray(hooks[k]) ? hooks[k].length : 1;
            });
            return num;
        },
        fnArgs() {
            return [getInjectArg(this.t)];
        },
        createOptions() {
            const options = [];
            this.eventList.forEach(name => {
                options.push({
                    label: name + (this.eventInfo[name] ? ` - ${this.eventInfo[name]}` : ''),
                    key: name,
                    disabled: Object.keys(this.event).indexOf(name) > -1
                });
            });
            if (this.eventList.length > 0 && this.hookList.length > 0) {
                options.push({ type: 'divider' });
            }
            this.hookList.forEach(hook => {
                options.push({
                    label: hook + (this.eventInfo[hook] ? ` - ${this.eventInfo[hook]}` : ''),
                    key: hook,
                    disabled: Object.keys(this.event).indexOf(hook) > -1
                });
            });
            if (this.eventList.length > 0 || this.hookList.length > 0) {
                options.push({ type: 'divider' });
            }
            options.push({
                label: this.t('props.custom'),
                key: 'custom'
            });
            return options;
        }
    },
    watch: {
        visible(v) {
            this.event = v ? this.loadFN() : {};
            if (!v) {
                this.destroy();
                this.closeCus();
            }
        },
    },
    methods: {
        handleCreateSelect(key) {
            if (key === 'custom') {
                this.cusEvent();
            } else {
                this.add(key);
            }
        },
        addCus() {
            const val = this.cusValue && this.cusValue.trim();
            if (val) {
                this.closeCus();
                this.add(val);
            }
        },
        closeCus() {
            this.cus = false;
            this.cusValue = '';
        },
        cusEvent() {
            this.cus = true;
        },
        loadFN() {
            const e = deepExtend({}, this.modelValue || {});
            const hooks = this.activeRule ? {...this.activeRule._hook || {}} : {};
            Object.keys(hooks).forEach(k => {
                e['hook_' + k] = hooks[k];
            })
            const val = {};
            Object.keys(e).forEach(k => {
                if (Array.isArray(e[k])) {
                    const data = [];
                    e[k].forEach(v => {
                        if (isFNX(v)) {
                            data.push(v.replace($T, ''));
                        } else if (is.Function(v) && isFNX(v.__json)) {
                            data.push(v.__json.replace($T, ''));
                        } else if (v && v.indexOf('$GLOBAL:') === 0) {
                            data.push(v);
                        }
                    });
                    val[k] = data;
                } else if (isFNX(e[k])) {
                    val[k] = [e[k].replace($T, '')];
                } else if (is.Function(e[k])) {
                    const json = e[k].__json || '';
                    if (!json) {
                        val[k] = ['' + e[k]];
                    } else if (isFNX(json)) {
                        val[k] = [json.replace($T, '')];
                    } else {
                        val[k] = [json];
                    }
                } else if (e[k] && e[k].indexOf('$GLOBAL:') === 0) {
                    val[k] = [e[k]];
                }
            });
            return val;
        },
        parseFN(e) {
            const on = {};
            const hooks = {};
            Object.keys(e).forEach(k => {
                const lst = [];
                e[k].forEach((v, i) => {
                    lst[i] = v.indexOf('$GLOBAL:') !== 0 ? ($T + v) : v;
                });
                if (lst.length > 0) {
                    if (k.indexOf('hook_') > -1) {
                        hooks[k.replace('hook_', '')] = lst.length === 1 ? lst[0] : lst;
                    } else {
                        on[k] = lst.length === 1 ? lst[0] : lst;
                    }
                }
            });
            return {hooks, on};
        },
        add(name) {
            let data = {};
            if (Array.isArray(this.event[name])) {
                this.event[name].push('');
                data = {
                    name,
                    item: this.event[name],
                    index: this.event[name].length - 1,
                };
            } else if (this.event[name]) {
                const arr = [this.event[name], ''];
                this.event[name] = arr;
                data = {
                    name,
                    item: arr,
                    index: 1,
                };
            } else {
                const arr = [''];
                this.event[name] = arr;
                data = {
                    name,
                    item: arr,
                    index: 0,
                };
            }
            if (!this.activeData) {
                this.edit(data);
            }
        },
        edit(data) {
            data.key = unique();
            if (data.item) {
                this.val = data.item[data.index];
            } else {
                this.val = this.event[data.name];
            }
            this.activeData = data;
            this.eventStr = this.val;
            this.defActive = data.name + (data.index || 0);
        },
        save() {
            if (!this.$refs.fn.save()) {
                return;
            }
            const str = this.eventStr;

            if (this.activeData.item) {
                this.activeData.item[this.activeData.index] = str;
            } else {
                this.event[this.activeData.name] = str;
            }
            this.destroy();
        },
        rm(data) {
            if (data.index !== undefined) {
                data.item.splice(data.index, 1);
                if(data.item.length === 0) {
                    delete this.event[data.name];
                }
            } else {
                delete this.event[data.name];
            }
            if (this.defActive === (data.name + (data.index || 0))) {
                this.destroy();
            }
        },
        destroy() {
            this.activeData = null;
            this.val = null;
            this.defActive = 'no';
        },
        close() {
            this.destroy();
        },
        submit() {
            if (this.activeData) {
                return errorMessage(this.t('event.saveMsg'));
            }
            const {on, hooks} = this.parseFN(this.event);
            this.$emit('update:modelValue', on);
            this.activeRule._hook = hooks;
            this.visible = false;
            this.destroy();
            this.closeCus();
        },
    },
    beforeCreate() {
        window.$inject = {
            $f: {},
            rule: [],
            self: {},
            option: {},
            inject: {},
            args: [],
        };
    }
});
</script>

<style>

._fd-event .n-button {
    font-weight: 400;
    width: 100%;
    border-color: #2E73FF;
    color: #2E73FF;
}

._fd-event .n-badge {
    width: 100%;
}

._fd-event-dialog .n-modal-body {
    padding: 10px 20px;
}

._fd-event-con .n-layout-content {
    padding: 0;
}

._fd-event-l, ._fd-event-r {
    display: flex;
    flex-direction: column;
    flex: 1;
    height: 100%;
    border: 1px solid #ececec;
}

._fd-event-dropdown .n-dropdown-menu {
    max-height: 500px;
    overflow: auto;
}

._fd-event-head {
    display: flex;
    padding: 5px 15px;
    border-bottom: 1px solid #eee;
    background: #f8f9ff;
    align-items: center;
}

._fd-event-head .n-button--text {
    color: #2f73ff;
}

._fd-event-r {
    border-left: 0 none;
}

._fd-event-r ._fd-event-head {
    justify-content: space-between;
}

._fd-event-l > .n-layout-content, ._fd-event-r > .n-layout-content {
    display: flex;
    flex-direction: row;
    flex: 1;
    flex-basis: auto;
    box-sizing: border-box;
    min-width: 0;
    width: 100%;
}

._fd-event-r > .n-layout-content {
    flex-direction: column;
}

._fd-event-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    max-width: 250px;
    font-size: 14px;
    overflow: hidden;
    white-space: pre-wrap;
}

._fd-event-item ._fd-label {
    font-size: 12px;
    color: #AAAAAA;
}

._fd-event-l .n-menu {
    padding: 0 10px 5px;
    border-right: 0 none;
    width: 100%;
    border-top: 0 none;
    overflow: auto;
}

._fd-event-l .n-menu-item--selected {
    background: #e4e7ed;
    color: #303133;
}

._fd-event-l .n-menu-item {
    height: auto;
    line-height: 1em;
    border: 1px solid #ECECEC;
    border-radius: 5px;
    padding: 0;
    margin-top: 5px;
}

._fd-event-method {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 225px;
    font-size: 14px;
    font-family: monospace;
    color: #9D238C;
    overflow: hidden;
    white-space: pre-wrap;
}

._fd-event-method ._fd-label {
    margin-top: 4px;
    color: #AAAAAA;
    font-size: 12px;
}

._fd-event-method > span:first-child, ._fd-fn-list-method > span:first-child {
    color: #9D238C;
}

._fd-event-method > span:first-child > span, ._fd-fn-list-method > span:first-child > span {
    color: #000;
    margin-left: 10px;
}

._fd-event-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 10px 0;
}

._fd-event-title .fc-icon {
    margin-right: 6px;
    font-size: 18px;
    color: #282828;
}

._fd-event-title .n-input {
    width: 200px;
}

._fd-event-title .n-input .n-input__input-el {
    box-shadow: none;
}

._fd-event-title .n-menu-item--selected i {
    color: #282828;
}

._fd-event-con .CodeMirror {
    height: 100%;
    width: 100%;
}

._fd-event-con .CodeMirror-wrap pre.CodeMirror-line {
    padding-left: 20px;
}
</style>
