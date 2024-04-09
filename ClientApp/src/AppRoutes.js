import ApiAuthorzationRoutes from './components/api-authorization/ApiAuthorizationRoutes';
import { Home } from "./components/Home";
import Play from "./components/Play";
import Profile from "./components/Profile";
import TopList from "./components/TopList";


//defining routes for components 
//specifying whether auth is required for certain routes
const AppRoutes = [
    {
        index: true,
        element: <Home />
    },
    {
        path: '/play',
        requireAuth: true,
        element: <Play />
    },    
    {
        path: '/profile',
        requireAuth: true,
        element: <Profile />
    },
    {
        path: '/toplist',
        element: <TopList />
    },
    
    ...ApiAuthorzationRoutes
];

export default AppRoutes;
