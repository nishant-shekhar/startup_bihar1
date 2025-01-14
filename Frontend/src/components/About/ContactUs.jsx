import React from 'react'
import NavBarNew from '../HomePage/NavBarNew'
import Footer from '../HomePage/footer'
import contacts from './data'
import ContactCard from './ContactCard'



const ContactUs = () => {

	const leadership = [
		{
			id: 0,
			name: 'Smt Bandana Preyashi, IAS',
			email: 'secy.ind-bih@nic.in',
			phone: '0612-2215211',
			image: 'https://bsidc.in/images/Bandana-Preyashi.jpg',
			position: 'Secretary, Industries Department of Industries, GoB',
			tag: 'Secretary Industry'
		},
		{
			id: 1,
			name: 'Sri Alok Ranjan Ghosh, IAS',
			email: 'dir.ind-bih@nic.in',
			phone: '0612-2235812',
			image: 'https://firebasestorage.googleapis.com/v0/b/gatishaktibihar.firebasestorage.app/o/startup_bihar%2Falok%20sir.jpg?alt=media&token=28a40104-b904-4854-bd54-44fa0db093a1',
			position: 'Director Industries, Department of Industries, GoB',
			tag: 'Director Industry'
		},
		{
			id: 2,
			name: 'Sri Nikhil Dhanraj Nippanikar , IAS',
			email: 'dirhs-bih@gov.in',
			phone: '0612-2215637',
			image: 'https://firebasestorage.googleapis.com/v0/b/gatishaktibihar.firebasestorage.app/o/startup_bihar%2Fnikhil%20sir.png?alt=media&token=27791704-aff7-4fcb-97ef-54a6132bd8b3',
			position: 'Directorate of Handloom and Sericulture',
			tag: 'Director H S (Startup)'
		},
		{
			id: 3,
			name: 'Jyoti Kumari',
			email: 'jyoti@example.com',
			phone: '9031863179',
			image: 'https://firebasestorage.googleapis.com/v0/b/gatishaktibihar.firebasestorage.app/o/startup_bihar%2Fjyoti%20mam.jpeg?alt=media&token=16a2240b-1708-43eb-965e-a433c21c2bb2',
			position: 'Assistant Director',
			tag: 'Nodal Officer'
		},
	];


	return (
		<div className="h-screen ">

			<div>
				<NavBarNew />
				<div className="text-center px-4">
					<p className="text-xl md:text-md font-bold text-[#303462] data-aos=fade-up pt-32">Startup Bihar</p>
					<h2 className="pt-2 text-3xl md:text-4xl lg:text-5xl font-bold text-[#303462]">Leadership Team</h2>

				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-10 py-6  mb-2">
					{leadership.map((contact) => (
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
				<div className="text-center mb-8 px-4">

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