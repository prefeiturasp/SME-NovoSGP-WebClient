import { persistStore, persistReducer } from 'redux-persist';
import thunk from 'redux-thunk';
import storage from 'redux-persist/lib/storage';
import rootReducer from '~/redux/modulos/reducers';
import { configureStore } from '@reduxjs/toolkit';
import { enableMapSet, setAutoFreeze } from 'immer';

// Fixes "Cannot assign to read only property" error message
// when modifying objects from Redux state directly.
setAutoFreeze(false);

const persistConfig = {
  key: 'sme-sgp',
  storage,
  whitelist: ['usuario', 'perfil', 'filtro', 'mensagens', 'dashboard'],
  blacklist: ['calendarioEscolar', 'calendarioProfessor'],
};

enableMapSet();

const persistedReducer = persistReducer(persistConfig, rootReducer);

console.log('asdasdasdas', process.env.NODE_ENV);
const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk],
  devTools: process.env.NODE_ENV !== 'production', // TESTEAR NO NAVEGADOR
});

const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export { store, persistor };
