<template>
    <n-dropdown
        class="_fd-type-select"
        trigger="click"
        :disabled="disabled || !menus.length"
        :options="menuOptions"
        :show-arrow="!disabled && menus.length"
        @select="handleCommand"
        placement="bottom-start"
    >
        <n-tag type="success" :bordered="false">
            <span>
                <template v-if="activeRule && !disabled && menus.length">
                    <i class="fc-icon icon-down"></i>
                </template>
                <template v-else-if="!activeRule">
                    <span>{{
                        t('com.' + (customForm.config.name) + '.name') || customForm.config.label || customForm.config.name || 'Component'
                    }}</span>
                </template>
                <template v-else>
                    <span>&nbsp;</span>
                </template>
            </span>
        </n-tag>
    </n-dropdown>
</template>

<script>
import {defineComponent} from 'vue';
import {NDropdown, NTag} from 'naive-ui';

export default defineComponent({
    name: 'TypeSelect',
    inject: ['designer'],
    components: {
        NDropdown,
        NTag
    },
    props: {
        disabled: Boolean,
    },
    computed: {
        t() {
            return this.designer.setupState.t;
        },
        activeRule() {
            return this.designer.setupState.activeRule;
        },
        customForm() {
            return this.designer.setupState.customForm;
        },
        menus() {
            let menus = [];
            const designer = this.designer.setupState;
            if (this.activeRule) {
                const name = this.activeRule._menu.name;
                const switchConfig = designer.getConfig('switchType', []);
                if (switchConfig === false) {
                    return menus;
                }
                let switchs = [];
                switchConfig.forEach(lst => {
                    if (lst.indexOf(name) > -1) {
                        switchs.push(...lst);
                    }
                });
                switchs = switchs.filter((key, idx) => {
                    return key !== name && switchs.indexOf(key) === idx;
                });
                if (switchs.length) {
                    designer.menuList.forEach(item => {
                        item.list.forEach(menu => {
                            if (switchs.indexOf(menu.name) > -1) {
                                menus.push(menu);
                            }
                        });
                    });
                } else {
                    designer.menuList.forEach(item => {
                        if (item.name === this.activeRule._menu.menu) {
                            item.list.forEach(menu => {
                                if (menu.name !== name) {
                                    menus.push(menu);
                                }
                            });
                        }
                    });
                }
            }
            return menus.filter(menu => this.designer.setupState.hiddenItem.indexOf(menu.name) === -1);
        },
        menuOptions() {
            return this.menus.map(item => ({
                label: (this.t('com.' + item.name + '.name') || item.label),
                key: item
            }));
        }
    },
    methods: {
        handleCommand(item) {
            let activeRule = this.activeRule;
            let rule = this.activeRule;
            if (!rule._menu.inside) {
                rule = rule.__fc__.parent.rule;
            }
            const children = rule.__fc__.parent.rule.children;
            const replaceRule = this.designer.setupState.makeRule(item);
            let newRule = replaceRule;
            if (replaceRule.type === 'DragTool') {
                newRule = replaceRule.children[0];
            }
            if (newRule.field && activeRule.field) {
                ['title', 'info', 'field', 'validate', 'control', '$required'].forEach(k => {
                    newRule[k] = activeRule[k];
                });
            } else if (activeRule?.computed?.hidden) {
                newRule.computed = {hidden: activeRule.computed.hidden}
            }
            if (activeRule.name) {
                newRule.name = activeRule.name;
            }
            ['name', 'id', 'on'].forEach(k => {
                if (activeRule[k]) {
                    newRule[k] = activeRule[k];
                }
            })
            children.splice(children.indexOf(rule), 1, replaceRule);
            this.$nextTick(() => {
                this.designer.setupState.triggerActive(newRule);
            });
        }
    }
});
</script>

<style>
._fd-type-select {
    cursor: pointer;
}

._fd-type-select .n-tag {
    cursor: pointer;
}

._fd-type-select .fc-icon {
    font-size: 14px;
    margin-left: 4px;
}

._fd-type-select .n-dropdown-menu {
    max-height: 500px;
    overflow: auto;
}
</style>
