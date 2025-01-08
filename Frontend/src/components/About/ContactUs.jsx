import React from 'react'
import NavBarNew from '../HomePage/NavBarNew'
import Footer from '../HomePage/footer'
import contacts from './data'
import ContactCard from './ContactCard'

const ContactUs = () => {
  return (
	<div className="h-screen ">

			<div>
				<NavBarNew />
				<div className="text-center mb-8 px-4">
                    <p className="text-xl md:text-md font-bold text-[#303462] data-aos=fade-up pt-32">Startup Bihar</p>
                    <h2 className="pt-2 text-3xl md:text-4xl lg:text-5xl font-bold text-[#303462]">Startup Support Unit</h2>
                   
                </div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 p-10  mb-16">
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
			</div>
		);
}

export default ContactUs;