import {v4 as uuidv4} from 'uuid';

const getVersion = () => ({version: `v1-${uuidv4()}`});

export default {
  getVersion,
};
