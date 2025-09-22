import uniqueId from '@form-create/utils/lib/unique';
import {localeOptions, localeProps} from '../../utils';

const label = '计数器';
const name = 'InputNumber';

export default {
    menu: 'main',
    icon: 'icon-number',
    label,
    name,
    input: true,
    event: ['blur', 'focus', 'change'],
    validate: ['number', 'integer', 'float'],
    rule({t}) {
        return {
            type: name,
            field: uniqueId(),
            title: t('com.InputNumber.name'),
            info: '',
            $required: false,
            props: {}
        };
    },
    props(_, {t}) {
        return localeProps(t, name + '.props', [{type: 'switch', field: 'disabled'}, {
            type: 'InputNumber',
            field: 'min'
        }, {
            type: 'InputNumber',
            field: 'max',
        },  {
            type: 'InputNumber',
            title: 'precision',
            field: 'precision',
        }, {type: 'InputNumber', field: 'step', props: {min: 0}}, {
            type: 'switch',
            field: 'stepStrictly'
        }, {
            type: 'switch',
            field: 'controls',
            value: true
        }, {
            type: 'select',
            field: 'controlsPosition',
            options: localeOptions(t, [{label: 'default', value: ''}, {label: 'right', value: 'right'}])
        }, {type: 'input', field: 'placeholder'}]);
    }
};
