import {
    GET_CONTACTS,
    ADD_CONTACT,
    DELETE_CONTACT,
    CONTACT_ERROR,
    SET_CURRENT,
    CLEAR_CURRENT,
    CLEAR_CONTACTS,
    UPDATE_CONTACT,
    FILTER_CONTACT,
    CLEAR_FILTER
} from '../types'

export default(state, action) => {
    switch(action.type){
        case GET_CONTACTS:
            return {
                ...state,
                contacts: action.payload,
                loading: false
            }
        case ADD_CONTACT: 
            return {
                ...state,
                contacts: [action.payload, ...state.contacts],
                loading: false
            };
        case UPDATE_CONTACT:
            return {
                ...state,
                contacts: state.contacts.map(contact => contact._id === action.payload._id ? action.payload: contact),
                loading: false
            }
        case DELETE_CONTACT: 
            return {
                ...state,
                contacts: state.contacts.filter(contact =>contact._id !== action.payload )
            };
        case SET_CURRENT: 
            return {
                ...state,
                current: action.payload
            }
        case CLEAR_CURRENT: 
            return {
                ...state,
                current: null
            }
        case CLEAR_CONTACTS: 
            return {
                ...state,
                contacts: null,
                current: null,
                filtered: null,
                error: null,
                loading: true

            }
        case FILTER_CONTACT:
            return {
                ...state,
                filtered: state.contacts.filter(contact => {
                    const regex = new RegExp(`${action.payload}`, 'gi');
                    return contact.name.match(regex) || contact.email.match(regex);
                })
            };
        case CLEAR_FILTER: 
            return {
                ...state,
                filtered: null
            };
        case CONTACT_ERROR:
            return {
                ...state,
                error: action.payload
            }
            
        default:
            return state;
    }
}