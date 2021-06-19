import React, {useContext, useEffect} from 'react'
import Contacts from '../../components/contacts/Contacts'
import ContactForm from '../../components/contacts/ContactForm'
import Contactfiltered from '../../components/contacts/ContactFiltered'

import AuthContext from '../../components/context/auth/authContext'

const Home = () => {
    const authcontext = useContext(AuthContext);

    //==== make sure to authenticate and keep authenticated on the home page
    useEffect(() => {
        authcontext.loadUser();

        //eslint-disable-next-line
    }, [])

    return (
        <div className="grid-2">
            <div><ContactForm /> </div>
                <div>
                    <Contactfiltered />
                    <Contacts />
                </div>
            </div>
    )
}

export default Home
