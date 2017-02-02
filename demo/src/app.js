import Native from '../../src/index.js';
import router from './router.js';
import yhcms from './js/common.js';

const App = new Native();

App.run(router);

yhcms.rem();
