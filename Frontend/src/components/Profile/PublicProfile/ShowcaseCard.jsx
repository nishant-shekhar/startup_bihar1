import React from 'react'

const ShowcaseCard = ({imgurl , dateandtime , title , subtitle , tag}) => {
  return (
			<div>
				<div className="overflow-hidden rounded-lg shadow-lg flex-1 min-w-0 ">
					<div className="">
						<div className="mx-5 mt-4 ">
							<img src={imgurl} alt="" className="rounded-lg object-fill" />
						</div>
					</div>
					<div className="p-6">
						<div className="text-md text-green-500 font-semibold mb-2">
							{dateandtime}
						</div>
						<h3 className="text-xl font-semibold mb-2 truncate">
							{title}
						</h3>
						<div className="text-sm text-gray-600 truncate">
							{subtitle} • {tag}
						</div>

						<hr className="mt-3" />

						<button
							type="button"
							className="bg-blue-600 py-2 px-5 rounded-md mt-3 text-white"
						>
							Project
						</button>
					</div>
				</div>
			</div>
		);
}

export default ShowcaseCard;