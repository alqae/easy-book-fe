import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import logger from 'redux-logger';
import {
  configureStore,
  ThunkAction,
  Action,
  combineReducers,
  isRejectedWithValue,
  Middleware,
  // MiddlewareAPI,
} from '@reduxjs/toolkit';

import profileReducer from './slices/profile.slice';
import exampleReducer from './slices/example.slice';
import { toast } from '@/components/ui/use-toast';
import { ApiResponse } from '@/types/requests';
import authReducer from './slices/auth.slice';
import { api } from '@/lib/api';

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['profile'],
};

const rootReducer = combineReducers({
  auth: authReducer,
  example: exampleReducer,
  profile: profileReducer,
  [api.reducerPath]: api.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const rtkQueryErrorLogger: Middleware = () => (next) => (action: any) => {
  if (isRejectedWithValue(action) && 'status' in action.payload && 'data' in action.payload) {
    let description = '';

    if (action.payload.data) {
      description = action.payload.data.message;
    } else {
      description =
        'data' in action.error ? (action.error.data as ApiResponse).message : action.error.message;
    }

    toast({ title: 'Error', variant: 'destructive', description });
  }

  return next(action);
};

// export const refreshTokenMiddleware: Middleware =
//   (middlewareAPI: MiddlewareAPI) => (next) => async (action: any) => {
//     if (action.type.endsWith('/rejected') && action.payload?.status === 401) {
//       try {
//         const result = await middlewareAPI
//           .dispatch(api.endpoints.refreshToken.initiate() as any)
//           .unwrap();

//         localStorage.setItem('accessToken', result.data.accessToken);
//         localStorage.setItem('refreshToken', result.data.refreshToken);

//         if (!action.type.startsWith(api.endpoints.refreshToken.name)) {
//           console.log('primer dispatch');
//           // eslint-disable-next-line no-debugger
//           debugger;
//           return middlewareAPI.dispatch(action);
//         }
//       } catch (error) {
//         toast({ title: 'Error', variant: 'destructive', description: 'Failed to refresh token' });
//       }
//     }

//     return next(action);
//   };

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoreActions: true,
      },
    })
      .concat(logger)
      .concat(api.middleware)
      // .concat(refreshTokenMiddleware)
      .concat(rtkQueryErrorLogger),
});
export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
