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
			image: 'https://firebasestorage.googleapis.com/v0/b/gatishaktibihar.firebasestorage.app/o/startup_bihar%2Fsecy_industry.jpeg?alt=media&token=68ad4faf-27a5-4c37-abde-c06bcef42baf',
			position: 'Secretary, Department of Industries, GoB',
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
			email: 'startup-bihar@gov.in',
			phone: '9031863179',
			image: 'https://firebasestorage.googleapis.com/v0/b/gatishaktibihar.firebasestorage.app/o/startup_bihar%2Fjyoti%20mam.jpeg?alt=media&token=16a2240b-1708-43eb-965e-a433c21c2bb2',
			position: 'Assistant Director',
			tag: 'Nodal Officer'
		},
	];
	const contactsSSU = [
	
		  
		  { 
			id: 1, 
			name: 'Manish Kumar Ranjan', 
			email: 'startup-bihar@gov.in',
			phone: '9262993981', 
			image: 'https://firebasestorage.googleapis.com/v0/b/gatishaktibihar.firebasestorage.app/o/startup_bihar%2FWhatsApp%20Image%202025-01-10%20at%2016.26.24.jpeg?alt=media&token=ea7e6d94-9b6c-4c15-b058-ba2fa51e97a3', 
			position: 'Co-ordinator Startup', 
			tag: 'StartUp Wing' 
		  },
		  { 
			id: 2, 
			name: 'Sudarshan Chakravarty', 
			email: 'startup-bihar@gov.in',
			phone: '6287797918', 
			image: 'https://firebasestorage.googleapis.com/v0/b/gatishaktibihar.firebasestorage.app/o/startup_bihar%2Fsudhanshu.jpeg?alt=media&token=056efe05-21c1-4f0d-b80a-065f4c737557', 
			position: 'Consultant (Startup)', 
			tag: 'StartUp Wing' 
		  },
		
		  { 
			id: 4, 
			name: 'Megha Bhadani', 
			email: 'startup-bihar@gov.in',
			phone: '6287797917', 
			image: 'https://media.licdn.com/dms/image/v2/D4D03AQHqnpo50HZYzg/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1702572081651?e=1741824000&v=beta&t=7pssZfd6QEKC0Qi3AdnZp6ftqYtRiUfKa1hK7BKMZ-g', 
			position: 'Consultant (Finance)', 
			tag: 'Finance Wing' 
		  },
		  { 
			id: 5, 
			name: 'Shivendra Kumar', 
			email: 'startup-bihar@gov.in',
			phone: '6287797916', 
			image: 'https://firebasestorage.googleapis.com/v0/b/gatishaktibihar.firebasestorage.app/o/startup_bihar%2FWhatsApp%20Image%202025-01-10%20at%2018.07.30.jpeg?alt=media&token=7bf4edd7-adb2-48d6-b032-a13007630b01', 
			position: 'Jr. Consultant (Finance)', 
			tag: 'Finance Wing' 
		  },
		  { 
			id: 6, 
			name: 'Pushkar Parag', 
			email: 'startup-bihar@gov.in',
			phone: '9262993979', 
			image: 'https://firebasestorage.googleapis.com/v0/b/gatishaktibihar.firebasestorage.app/o/startup_bihar%2Fpushkar.jpeg?alt=media&token=8a2385c3-3a0b-4716-984f-85784ee50b2e', 
			position: 'Co-ordinator Finance', 
			tag: 'Finance Wing' 
		  },
		  { 
			id: 7, 
			name: 'Kunal Prakash', 
			email: 'startup-bihar@gov.in',
			phone: '9262993980', 
			image: 'https://firebasestorage.googleapis.com/v0/b/gatishaktibihar.firebasestorage.app/o/startup_bihar%2FWhatsApp%20Image%202025-01-10%20at%2018.32.46.jpeg?alt=media&token=cf286280-dda5-4cc6-b70e-fe63a8519306', 
			position: 'Co-ordinator Finance', 
			tag: 'Finance Wing' 
		  },
		  { 
			id: 8, 
			name: 'Mukesh Kumar', 
			email: 'startup-bihar@gov.in',
			phone: '6287797919', 
			image: 'https://firebasestorage.googleapis.com/v0/b/gatishaktibihar.firebasestorage.app/o/startup_bihar%2Fmukesh%20ji.jpeg?alt=media&token=5f39811c-3085-42a5-94de-7be57a9cba32', 
			position: 'Jr. Consultant (IT)', 
			tag: 'IT Wing' 
		  }
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
					{contactsSSU.map((contact) => (
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