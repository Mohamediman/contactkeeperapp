import React, { useState, useContext, useEffect } from "react";
import ContactContext from "../../components/context/contact/contactContext";

const ContactForm = () => {
	const contactContext = useContext(ContactContext);

	const { addContact, current, clearCurrent, updateContact } = contactContext;

	useEffect(() => {
		if (current) {
			setContact(current);
		} else {
			setContact({
				name: "",
				email: "",
				phone: "",
				type: "personal",
			});
		}
	}, [contactContext, current]);

	const [contact, setContact] = useState({
		name: "",
		email: "",
		phone: "",
		type: "personal",
	});

	const { name, email, type, phone } = contact;
	const onChange = (e) =>
		setContact({ ...contact, [e.target.name]: e.target.value });

	const onSubmit = (e) => {
		e.preventDefault();
		if (current !== null) {
			updateContact(contact);
		} else {
			addContact(contact);
		}
		clearAll();
	};

	const clearAll = () => {
		clearCurrent();
	};
	return (
		<form onSubmit={(e) => onSubmit(e)}>
			<h2 className='text-primary'>
				{current ? "Update Content" : "Add Contact"}
			</h2>
			<input
				type='text'
				placeholder='Name'
				name='name'
				value={name}
				onChange={(e) => onChange(e)}
			/>
			<input
				type='email'
				placeholder='Email'
				name='email'
				value={email}
				onChange={(e) => onChange(e)}
			/>
			<input
				type='text'
				placeholder='Phone'
				name='phone'
				value={phone}
				onChange={(e) => onChange(e)}
			/>
			<h5>Contact Type</h5>
			<input
				type='radio'
				name='type'
				value='personal'
				checked={type === "personal"}
				onChange={(e) => onChange(e)}
			/>{" "}
			Personal{" "}
			<input
				type='radio'
				name='type'
				value='professional'
				checked={type === "professional"}
				onChange={(e) => onChange(e)}
			/>{" "}
			Professional
			<div>
				<input
					type='submit'
					value={current ? "Update Content" : "Add Contact"}
					className='btn btn-primary btn-block'
				/>
			</div>
			{current && (
				<div>
					<button className='btn btn-light btn-block' onClick={clearAll}>
						Clear
					</button>
				</div>
			)}
		</form>
	);
};

export default ContactForm;
