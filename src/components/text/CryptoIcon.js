import { createIconSet } from 'react-native-vector-icons';
const glyphMap = {
  'bitcoin': '',
  'bitcoin-alt': '',
  'dash': '',
  'dash-alt': '',
  'litecoin': '',
  'litecoin-alt': '',
};
const CryptoIcon = createIconSet(glyphMap, 'cryptocoins-icons');
export default CryptoIcon;
