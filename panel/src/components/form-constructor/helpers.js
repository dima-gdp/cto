export const FIELDS_SETTINGS_MAP = {
  text: {
    required: true,
    copy: true,
    provider: false,
    other: false,
    showLabel: true,
    extensions: false,
    settings: { col: true },
  },
  string: {
    required: true,
    copy: true,
    provider: false,
    other: false,
    showLabel: true,
    extensions: false,
    settings: { col: true },
  },
  select: {
    required: true,
    copy: true,
    provider: true,
    other: true,
    showLabel: true,
    extensions: false,
    settings: { col: true },
  },
  multiselect: {
    required: true,
    copy: false,
    provider: false,
    other: false,
    showLabel: true,
    extensions: false,
    settings: { col: true },
  },
  radio: {
    required: true,
    copy: false,
    provider: false,
    other: false,
    showLabel: true,
    extensions: false,
    settings: { col: true },
  },
  datatime: {
    required: true,
    copy: false,
    provider: false,
    other: false,
    showLabel: true,
    extensions: false,
    settings: { col: true },
  },
  checkbox: {
    required: true,
    copy: false,
    provider: false,
    other: false,
    showLabel: true,
    extensions: false,
    settings: { col: true },
  },
  phone: {
    required: true,
    copy: true,
    provider: false,
    other: false,
    showLabel: true,
    extensions: false,
    settings: { col: true },
  },
  file: {
    required: true,
    copy: false,
    provider: false,
    other: false,
    showLabel: true,
    extensions: true,
    settings: { col: true },
  },
  location: {
    required: true,
    copy: true,
    provider: false,
    other: false,
    showLabel: true,
    extensions: false,
    settings: { col: true },
    dependentFormFieldId: true,
  },
  country: {
    required: true,
    copy: true,
    provider: false,
    other: false,
    showLabel: true,
    extensions: false,
    settings: { col: true },
  },
}

export const ICON_MAP = {
  text: 'md-paper',
  string: 'md-create',
  select: 'md-menu',
  multiselect: 'logo-buffer',
  radio: 'md-radio-button-on',
  datatime: 'md-calendar',
  checkbox: 'md-checkmark-circle-outline',
  phone: 'md-call',
  file: 'md-cloud-upload',
}
