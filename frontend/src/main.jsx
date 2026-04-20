import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {BrowserRouter} from "react-router-dom";

import './index.css'
import App from './App.jsx'

const rootElement = document.getElementById("root");

const RootComponent = (
	<BrowserRouter>
		<App/>
	</BrowserRouter>
);

createRoot(rootElement).render(
	import.meta.env.DEV ? <StrictMode>{RootComponent}</StrictMode> : RootComponent
);