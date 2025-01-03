import React from 'react'
import NavBarNew from '../HomePage/NavBarNew'
import Footer from '../HomePage/Footer'
import contacts from './data'
import ContactCard from './ContactCard'

const ContactUs = () => {
  return (
			<div>
				<NavBarNew />
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 p-10 mt-32 mb-16">
					{contacts.map((contact) => (
						<ContactCard
							key={contact.id}
							name={contact.name}
							email={contact.email}
							phone={contact.phone}
							image={contact.image}
							position={contact.position}
							tag={contact.tag}
						/>
					))}
				</div>
				<Footer />
			</div>
		);
}

export default ContactUs;