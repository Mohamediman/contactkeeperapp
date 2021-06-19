import React, { useReducer } from 'react'
import alertReducer from './alertReducer'
import AlertContext from './alertContext'

import {
    SET_ALERT, REMOVE_ALERT
} from '../types'



const AlertState = props => {
    const initialState = [];

    const [state, dispatch] = useReducer(alertReducer, initialState);


    /* this where all the actions go */

    // set alert
    const setAlert = (msg, type, timeout = 5000) => {
        const id = Math.floor(Math.random() * 1000 );
        dispatch({
            type: SET_ALERT,
            payload: {msg, type, id }
        })

        setTimeout(()=>dispatch({type: REMOVE_ALERT, payload: id }), timeout)
    }
    
    return (
        <AlertContext.Provider
            value={{
                alerts: state,
                setAlert
            }}>

            {props.children}

        </AlertContext.Provider>
    )

};


export default AlertState;