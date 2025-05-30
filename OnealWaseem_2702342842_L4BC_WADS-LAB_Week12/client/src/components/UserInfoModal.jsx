import React from "react";

const UserInfoModal = ({ user, onClose }) => {
  return (    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/95 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-green-800">User Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <p className="mt-1 text-gray-900">{user?.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Personal ID</label>
            <p className="mt-1 text-gray-900">{user?.personal_id}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <p className="mt-1 text-gray-900">{user?.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <p className="mt-1 text-gray-900">{user?.address || "Not provided"}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <p className="mt-1 text-gray-900">{user?.phone_number || "Not provided"}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Joined Date</label>
            <p className="mt-1 text-gray-900">
              {user?.joinedAt ? new Date(user.joinedAt).toLocaleDateString() : "Not available"}
            </p>
          </div>
        </div>
        <div className="mt-6">
        </div>
      </div>
    </div>
  );
};

export default UserInfoModal;
