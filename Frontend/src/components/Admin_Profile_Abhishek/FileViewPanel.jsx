import React from 'react'

const FileViewPanel = ({field , handleViewPdf}) => {
  return (
				<div className="px-4 py-4 ">
					<dd className="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
						<ul className="divide-y divide-gray-100 rounded-md border border-gray-200">
							<li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm/6">
								<div className="flex w-0 flex-1 items-center">
									<svg
										className="h-5 w-5 shrink-0 text-gray-400"
										viewBox="0 0 20 20"
										fill="currentColor"
										aria-hidden="true"
										data-slot="icon"
									>
										<path
											fillRule="evenodd"
											d="M15.621 4.379a3 3 0 0 0-4.242 0l-7 7a3 3 0 0 0 4.241 4.243h.001l.497-.5a.75.75 0 0 1 1.064 1.057l-.498.501-.002.002a4.5 4.5 0 0 1-6.364-6.364l7-7a4.5 4.5 0 0 1 6.368 6.36l-3.455 3.553A2.625 2.625 0 1 1 9.52 9.52l3.45-3.451a.75.75 0 1 1 1.061 1.06l-3.45 3.451a1.125 1.125 0 0 0 1.587 1.595l3.454-3.553a3 3 0 0 0 0-4.242Z"
											clipRule="evenodd"
										/>
									</svg>
									<div className="ml-4 flex min-w-0 flex-1 gap-2">
										<span className="truncate font-medium">
											{field ? (
												field
											) : (
												<span className="text-red-500">
													File is either rejected or not available
												</span>
											)}
										</span>
									</div>
								</div>
								<div className="ml-4 shrink-0">
									<button
										onClick={() => handleViewPdf(field)}
										className="font-medium text-indigo-600 hover:text-indigo-900"
									>
										View
									</button>
								</div>
								<div className="ml-4 shrink-0">
									<a
										href={field}
										download
										className="font-medium text-indigo-600 hover:text-indigo-900"
									>
										Download
									</a>
								</div>
							</li>
						</ul>
					</dd>
				</div>
		);
}

export default FileViewPanel