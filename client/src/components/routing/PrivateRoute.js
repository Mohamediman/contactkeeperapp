import React, {useContext} from 'react'
import {Route, Redirect } from 'react-router-dom'
import AuthContext  from '../context/auth/authContext'

const PrivateRoute = ({component: Component, ...rest}) => {
    const authContext = useContext(AuthContext);

    const { isAuthenticated, loading } = authContext;

    // return (
    //     <Route {...rest} render = {
    //         props => !isAuthenticated && loading ? (<Redirect to='/login' />): (<Component {...props} />)
    //       }
    //     />
    // )

    return (
        <Route 
            {...rest} 
            render={(props) => {
            if(!isAuthenticated){
                return <Redirect to='/login' />
            } else {
                return <Component {...props} />
            }
        }}
        />
    )
}

export default PrivateRoute
