export default function AdminDashBoard() {
    return (
        <>
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">Logout</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">Users</h2>
                        <div className="flex justify-between items-center border-b border-gray-300 pb-4 mb-4">
                            <p className="text-lg">Total Users:</p>
                            <p className="text-lg font-bold">1000</p>
                        </div>
                        <div className="flex justify-between items-center border-b border-gray-300 pb-4 mb-4">
                            <p className="text-lg">Active Users:</p>
                            <p className="text-lg font-bold">500</p>
                        </div>
                        <div className="flex justify-between items-center border-b border-gray-300 pb-4 mb-4">
                            <p className="text-lg">Blocked Users:</p>
                            <p className="text-lg font-bold">100</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">Channels</h2>
                        <div className="flex justify-between items-center border-b border-gray-300 pb-4 mb-4">
                            <p className="text-lg">Total Channels:</p>
                            <p className="text-lg font-bold">50</p>
                        </div>
                        {/* Add more channel-related information */}
                        <button className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">Block Room</button>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">Active Users</h2>
                        <div className="flex justify-between items-center border-b border-gray-300 pb-4 mb-4">
                            <p className="text-lg">Total Active Users:</p>
                            <p className="text-lg font-bold">500</p>
                        </div>
                        {/* Add more active users-related information */}
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">Blocked Users</h2>
                        <div className="flex justify-between items-center border-b border-gray-300 pb-4 mb-4">
                            <p className="text-lg">Total Blocked Users:</p>
                            <p className="text-lg font-bold">100</p>
                        </div>
                        {/* Add more blocked users-related information */}
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">Premium Members</h2>
                        <div className="flex justify-between items-center border-b border-gray-300 pb-4 mb-4">
                            <p className="text-lg">Total Premium Members:</p>
                            <p className="text-lg font-bold">500</p>
                        </div>
                        {/* Add more order-related information */}
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">Join Room</h2>
                        <div className="flex justify-between items-center border-b border-gray-300 pb-4 mb-4">
                        <button className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">Join</button>
                        </div>
                        {/* Add more join room-related information */}
                    </div>
                    {/* Add more feature cards as needed */}
                </div>
            </div>
        </div>
        </>
    );
}
