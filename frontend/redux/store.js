import { configureStore, applyMiddleware } from '@reduxjs/toolkit';

import reducers from './reducers';
import redirectMiddleware from './middleware/redirect-middleware';

const store = configureStore({
  reducer: reducers,
  middleware: [redirectMiddleware]
});

export default store;