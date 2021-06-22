import {BrowserRouter as Router,Switch,Route} from 'react-router-dom';
import Home from './pages/Home';
import Login from './components/auth/Login'
import Signup from './components/auth/Signup';
import Dashboard from './pages/Dashboard';

import PrivateRoute from './components/routing/PrivateRoute';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Profile from './components/auth/Profile';
import UserAnalysis from './pages/UserAnalysis';
import TweetsAnalyser from './pages/TweetsAnalyser';
import RecentAnalysis from './pages/RecentAnalysis';


function App() {
  return (
    <Router>
    <ToastContainer/>
      <Switch>
        <Route exact path="/" component={Home}></Route>
        <Route exact path="/login" component={Login}></Route>
        <Route exact path="/signup" component={Signup}></Route>
        <PrivateRoute exact path="/dashboard" component={Dashboard}></PrivateRoute>
        <PrivateRoute exact path="/user-analysis" component={UserAnalysis}></PrivateRoute>
        <PrivateRoute exact path="/tweet/:id" component={TweetsAnalyser}></PrivateRoute>
        <PrivateRoute exact path="/recent/analysis" component={RecentAnalysis}></PrivateRoute>
        <PrivateRoute exact path="/profile" component={Profile}></PrivateRoute>
      
      </Switch>
    
    
    </Router>
  );
}

export default App;
