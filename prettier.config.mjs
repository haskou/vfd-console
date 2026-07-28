import prettierConfig from '@haskou/eslint-config/prettier';

const supportedPrettierConfig = { ...prettierConfig };
delete supportedPrettierConfig.jsxBracketSameLine;

export default supportedPrettierConfig;
