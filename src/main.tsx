import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {Provider} from "react-redux";
import {BrowserRouter} from "react-router-dom";
import App from '@/App';
import { store } from '@/app/store';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <BrowserRouter>
          <Provider store={store}>
              <App />
          </Provider>
      </BrowserRouter>
  </StrictMode>,
)
