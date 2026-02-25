import { createBrowserRouter, Outlet } from 'react-router-dom'
import Home from './Home'
import About from './About'
import Team from './Team'
import Events from './Events'
import { RouterProvider } from 'react-router-dom'
import Header from './Header'
import Gallery from './Gallery'
import Footer from './Footer'
import Register from './Register'
import ShareIdea from './ShareIdea'
import AdminLogin from './AdminLogin'

const AppLayout = () => {
    return (
        <>
            <Header />
            <main className="pt-20">
                <Outlet />
            </main>
            <Footer />
        </>
    );
};

const Body = () => {

    const appRouter = createBrowserRouter([
        {
            path: "/",
            element: <AppLayout />,
            children: [
                { index: true, element: <Home /> },
                { path: "about", element: <About /> },
                { path: "team", element: <Team /> },
                { path: "events", element: <Events /> },
                { path: "gallery", element: <Gallery /> },
                { path: "join/register", element: <Register /> },
                { path: "join/login", element: <AdminLogin /> },
                { path: "join/idea", element: <ShareIdea /> },
            ],
        },
    ]);

    return (
        <div>
            <RouterProvider router={appRouter} />
        </div>
    )
}

export default Body
