import React from 'react'
import NavBarNew from '../HomePage/NavBarNew'
import Footer from '../HomePage/Footer'
import contacts from './data'
import ContactCard from './ContactCard'



const ContactUs = () => {

	const leadership = [
		{
			id: 0,
			name: 'Sri Kundan Kumar, I.A.S.',
			email: 'prsecy.ind-bih@nic.in',
			phone: '0612-2215211',
			image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkiPticRwETbwqYFSc-9QSq31XbbnW7pzyxw&s',
			position: 'Secretary, Department of Industries, GoB',
			tag: 'Secretary, Industries'
		},
		{
			id: 1,
			name: 'Sri Mukul Kumar Gupta , IAS',
			email: 'dir.ind-bih@nic.in',
			phone: '0612-2235812',
			image: 'https://firebasestorage.googleapis.com/v0/b/gatishaktibihar.firebasestorage.app/o/startup_bihar%2FOfficers%2Fdir_inds.jpeg?alt=media&token=afc42da1-9249-463a-a336-94a4569e7f82',
			position: 'Director Industries, Department of Industries, GoB',
			tag: 'Director Industries'
		},
	
		{
			id: 3,
			name: 'Jyoti Kumari',
			email: 'startup-bihar@gov.in',
			phone: 'jyoti950@bihar.gov.in',
			//image: 'https://firebasestorage.googleapis.com/v0/b/gatishaktibihar.firebasestorage.app/o/startup_bihar%2Fjyoti%20mam.jpeg?alt=media&token=16a2240b-1708-43eb-965e-a433c21c2bb2',
			image: 'https://media.istockphoto.com/id/1223671392/vector/default-profile-picture-avatar-photo-placeholder-vector-illustration.jpg?s=612x612&w=0&k=20&c=s0aTdmT5aU6b8ot7VKm11DeID6NctRCpB755rA1BIP0=', 

			position: 'Assistant Director',
			tag: 'Nodal Officer'
		},
	];
	const contactsSSU = [
	
		   { 
			id: 1, 
			name: 'Gopi Krishna ', 
			email: 'startup-bihar@gov.in',
			phone: '7258071721', 
			image: 'https://media.istockphoto.com/id/1223671392/vector/default-profile-picture-avatar-photo-placeholder-vector-illustration.jpg?s=612x612&w=0&k=20&c=s0aTdmT5aU6b8ot7VKm11DeID6NctRCpB755rA1BIP0=', 
			position: 'Industries Extension Officer', 
			tag: 'StartUp Wing' 
		  },
		  { 
			id: 2, 
			name: 'Jyoti Kumari', 
			email: 'startup-bihar@gov.in',
			phone: '8210892215', 
			image: 'https://media.istockphoto.com/id/1223671392/vector/default-profile-picture-avatar-photo-placeholder-vector-illustration.jpg?s=612x612&w=0&k=20&c=s0aTdmT5aU6b8ot7VKm11DeID6NctRCpB755rA1BIP0=', 
			position: 'Assistant Section Officer', 
			tag: 'StartUp Wing' 
		  },
		  { 
			id: 3, 
			name: 'Manish Kumar Ranjan', 
			email: 'startup-bihar@gov.in',
			phone: '9262993981', 
			image: 'https://firebasestorage.googleapis.com/v0/b/gatishaktibihar.firebasestorage.app/o/startup_bihar%2FWhatsApp%20Image%202025-01-10%20at%2016.26.24.jpeg?alt=media&token=ea7e6d94-9b6c-4c15-b058-ba2fa51e97a3', 
			position: 'Co-ordinator Startup', 
			tag: 'StartUp Wing' 
		  },
		  { 
			id: 4, 
			name: 'Sudarshan Chakravarty', 
			email: 'startup-bihar@gov.in',
			phone: '6287797918', 
			image: 'https://firebasestorage.googleapis.com/v0/b/gatishaktibihar.firebasestorage.app/o/startup_bihar%2Fsudhanshu.jpeg?alt=media&token=056efe05-21c1-4f0d-b80a-065f4c737557', 
			position: 'Consultant (Startup)', 
			tag: 'StartUp Wing' 
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
			id: 7, 
			name: 'Kunal Prakash', 
			email: 'startup-bihar@gov.in',
			phone: '9262993980', 
			image: 'https://firebasestorage.googleapis.com/v0/b/gatishaktibihar.firebasestorage.app/o/startup_bihar%2FWhatsApp%20Image%202025-01-10%20at%2018.32.46.jpeg?alt=media&token=cf286280-dda5-4cc6-b70e-fe63a8519306', 
			position: 'Co-ordinator Finance', 
			tag: 'Finance Wing' 
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
				<div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4 px-10 py-6  mb-2">
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

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-10  mb-16">
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