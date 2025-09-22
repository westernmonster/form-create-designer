<template>
    <div class="_fd-language-config">
        <div class="_fc-l-info">
        </div>
        <div class="_fd-lc-header">
            <n-button size="small" type="error" ghost :disabled="!selected.length" @click="batchRmColumn">
            </n-button>
        </div>
        <div class="_fd-lc-body">
            <n-data-table :data="column" size="small" ref="table" :columns="tableColumns"
                          @update:checked-row-keys="selectionChange" :row-key="(row) => row.key">
            </n-data-table>
        </div>
    </div>

</template>

<script>
import {defineComponent, h} from 'vue';
import {copyTextToClipboard} from '../../utils';
import {NButton, NDataTable, NInput} from 'naive-ui';

export default defineComponent({
    name: 'LanguageConfig',
    components: {
        NButton,
        NDataTable,
        NInput
    },
    inject: ['designer'],
    computed: {
        localeOptions() {
            return this.designer.setupState.getConfig('localeOptions', [
                {value: 'zh-cn', label: '简体中文'},
                {value: 'en', label: 'English'},
            ]);
        },
        t() {
            return this.designer.setupState.t;
        },
        tableColumns() {
            const columns = [
                {
                    type: 'selection',
                    width: 30
                },
                {
                    title: 'Key',
                    key: 'key',
                    width: 90
                }
            ];

            this.localeOptions.forEach(item => {
                columns.push({
                    title: item.label,
                    key: item.value,
                    minWidth: 100,
                    render: (row) => {
                        if (row.input) {
                            return h(NInput, {
                                size: 'small',
                                value: row[item.value],
                                'onUpdate:value': (val) => {
                                    row[item.value] = val;
                                },
                                onBlur: () => this.saveColumn(row, true)
                            });
                        } else {
                            return row[item.value] || '-';
                        }
                    }
                });
            });

            columns.push({
                title: this.t('tableOptions.handle'),
                key: 'actions',
                width: 75,
                fixed: 'right',
                render: (row, index) => {
                    return h('div', { class: '_fd-lc-handle' }, [
                        !row.input ? h('i', {
                            class: 'fc-icon icon-edit',
                            onClick: () => { row.input = true; }
                        }) : h('i', {
                            class: 'fc-icon icon-check',
                            onClick: () => this.saveColumn(row)
                        }),
                        h('i', {
                            class: 'fc-icon icon-group',
                            onClick: () => this.copy(row.key)
                        }),
                        h('i', {
                            class: 'fc-icon icon-delete-circle',
                            onClick: () => this.rmColumn(index)
                        })
                    ]);
                }
            });

            return columns;
        },
    },
    data() {
        return {
            column: [],
            uni: 0,
            selected: [],
        }
    },
    methods: {
        copy(key) {
            copyTextToClipboard(key);
        },
        addColumn() {
            this.column.unshift({
                key: this.randomString(),
                input: true,
            })
        },
        saveColumn(row, input) {
            row.input = input || false;
            const language = this.designer.setupState.formOptions.language;
            this.localeOptions.forEach(item => {
                if (!language[item.value]) {
                    language[item.value] = {};
                }
                language[item.value][row.key] = row[item.value];
            })
        },
        rmColumn(idx) {
            const row = this.column[idx];
            this.column.splice(idx, 1);
            const language = this.designer.setupState.formOptions.language;
            this.localeOptions.forEach(item => {
                if (language[item.value]) {
                    delete language[item.value][row.key]
                }
            })
        },
        batchRmColumn() {
            this.selected.forEach(item => {
                this.rmColumn(this.column.indexOf(item));
            });
            this.selected = [];
        },
        selectionChange(keys) {
            this.selected = this.column.filter(item => keys.includes(item.key));
        },
        randomString() {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let result = '';
            const charactersLength = characters.length;

            for (let i = 0; i < 7; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return characters.charAt((this.uni++) % 26) + result;
        }
    },
    mounted() {
        const language = this.designer.setupState.formOptions.language || {};
        const column = {};
        Object.keys(language).forEach(lang => {
            Object.keys(language[lang]).forEach(key => {
                if (!column[key]) {
                    column[key] = {
                        key: key,
                    }
                }
                column[key][lang] = language[lang][key];
            })
        });
        this.column = Object.values(column);
    }

});
</script>

<style>
._fd-language-config {
    height: 100%;
    overflow: auto;
}

._fd-lc-body, ._fd-lc-header {
    padding: 0 12px;
}

._fd-lc-body {
    overflow: auto;
}

._fd-lc-header {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 12px;
}

._fd-language-config .n-data-table .n-data-table-td {
    height: 34px;
}

._fd-language-config ._fc-l-info {
    margin-bottom: 12px;
}

._fd-lc-handle {
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
}
</style>
