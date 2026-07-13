import generatePicker from 'antd/es/date-picker/generatePicker';
import momentGenerateConfig from 'antd/node_modules/rc-picker/lib/generate/moment';

const DatePickerMoment = generatePicker(momentGenerateConfig);

export default DatePickerMoment;
