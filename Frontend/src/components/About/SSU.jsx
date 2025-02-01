import React from 'react';
import NavBarNew from '../HomePage/NavBarNew';
import Footer from '../HomePage/footer';
import contacts from './data';
import ContactCard from './ContactCard';
import topImage from '/Users/nishantshekhar/Documents/GitHub/startup_bihar1/Frontend/src/assets/top_right.png';
import bottomImage from '/Users/nishantshekhar/Documents/GitHub/startup_bihar1/Frontend/src/assets/bottom_left.png';



const SSU = () => {
	return (
		<div
			className="relative h-screen overflow-y-auto bg-white"
			style={{
				backgroundImage: `url(${topImage}), url(${bottomImage})`,
				backgroundPosition: 'top right, bottom left',
				backgroundRepeat: 'no-repeat, no-repeat',
				backgroundAttachment: 'fixed, fixed', // This makes the images fixed
			}}
		>
			<div className="pt-4">
				<div className="text-center mb-2 px-4">

					<p className="text-xl md:text-md font-bold text-black pt-8">
					</p>
					<h2 className="pt-2 text-3xl md:text-4xl lg:text-5xl font-bold text-black">
					Startup Support Unit

                    </h2>

					<p className="text-sm text-gray-600 max-w-4xl mx-auto py-4">
						Contact the desired person based on their designation and category
					</p>
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-10 mt-6 mb-16">
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
			</div>
		</div>
	);
};

export default SSU;
