import * as base from './vars';

const vars = {
  ...base, ...{

    font: {
      fontFamily: 'Helvetica, serif'
    },

    color: {
      ...base.color,
      primary: base.color.blue,
      secondary: base.color.cyan,
      other: ''
    }

  }
};

export default {
  vars
};
