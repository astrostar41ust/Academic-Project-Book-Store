import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { addressAPI } from '../services/api';
import type { Address } from '../types';
import Header from '../components/Header';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    username: user?.username || '',
    name: '',
    email: user?.email || '',
    password: '**********',
    gender: 'male',
    birthDate: '',
    birthMonth: '',
    birthYear: '',
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  // Address management states
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [addressForm, setAddressForm] = useState({
    label: 'Home',
    recipient_name: '',
    phone_number: '',
    address_line1: '',
    address_line2: '',
    district: '',
    sub_district: '',
    province: '',
    postal_code: '',
    is_default: false,
  });
  const [loading, setLoading] = useState(false);

  // Load addresses on mount
  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      const data = await addressAPI.getAll();
      setAddresses(data);
    } catch (error) {
      console.error('Error loading addresses:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock save - 
    alert('Profile information saved successfully! (Mockup)');
  };

  const handleChangePassword = () => {
    // Mock change password
    alert('Change password feature is not available yet');
  };

  // Address handlers
  const handleAddressInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setAddressForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleOpenAddressModal = (address?: Address) => {
    if (address) {
      setEditingAddress(address);
      setAddressForm({
        label: address.label,
        recipient_name: address.recipient_name,
        phone_number: address.phone_number,
        address_line1: address.address_line1,
        address_line2: address.address_line2 || '',
        district: address.district,
        sub_district: address.sub_district,
        province: address.province,
        postal_code: address.postal_code,
        is_default: address.is_default,
      });
    } else {
      setEditingAddress(null);
      setAddressForm({
        label: 'Home',
        recipient_name: '',
        phone_number: '',
        address_line1: '',
        address_line2: '',
        district: '',
        sub_district: '',
        province: '',
        postal_code: '',
        is_default: addresses.length === 0,
      });
    }
    setShowAddressModal(true);
  };

  const handleCloseAddressModal = () => {
    setShowAddressModal(false);
    setEditingAddress(null);
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (editingAddress) {
        await addressAPI.update(editingAddress.id, addressForm);
      } else {
        await addressAPI.create(addressForm);
      }
      await loadAddresses();
      handleCloseAddressModal();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to save address');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (id: number) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    
    setLoading(true);
    try {
      await addressAPI.delete(id);
      await loadAddresses();
    } catch (error) {
      alert('Failed to delete address');
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefaultAddress = async (id: number) => {
    setLoading(true);
    try {
      await addressAPI.setDefault(id);
      await loadAddresses();
    } catch (error) {
      alert('Failed to set default address');
    } finally {
      setLoading(false);
    }
  };

  // Generate arrays for date dropdowns
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 pt-[120px]">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">My Information</h1>
            <p className="text-gray-600">
              Manage your personal information to keep your account secure
            </p>
          </div>

          {/* Profile Form */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
                {/* Left Column - Form Fields */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Username */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <label className="text-gray-700 font-medium w-full sm:w-40 text-right">
                      Username
                    </label>
                    <div className="flex-1">
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        disabled
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Name */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <label className="text-gray-700 font-medium w-full sm:w-40 text-right">
                      Name
                    </label>
                    <div className="flex-1">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your name"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <label className="text-gray-700 font-medium w-full sm:w-40 text-right">
                      Email
                    </label>
                    <div className="flex-1 flex items-center gap-3">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        className="text-blue-600 hover:text-blue-700 font-medium whitespace-nowrap"
                      >
                        Change
                      </button>
                    </div>
                  </div>

                  {/* Password */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <label className="text-gray-700 font-medium w-full sm:w-40 text-right">
                      Phone Number
                    </label>
                    <div className="flex-1 flex items-center gap-3">
                      <input
                        type="text"
                        value="**********14"
                        disabled
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                      />
                      <button
                        type="button"
                        onClick={handleChangePassword}
                        className="text-blue-600 hover:text-blue-700 font-medium whitespace-nowrap"
                      >
                        Change
                      </button>
                    </div>
                  </div>

                  {/* Gender */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <label className="text-gray-700 font-medium w-full sm:w-40 text-right">
                      Gender
                    </label>
                    <div className="flex-1 flex items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          value="male"
                          checked={formData.gender === 'male'}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-gray-700">male</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          value="female"
                          checked={formData.gender === 'female'}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-gray-700">female</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          value="other"
                          checked={formData.gender === 'other'}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-gray-700">other</span>
                      </label>
                    </div>
                  </div>

                  {/* Birth Date */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <label className="text-gray-700 font-medium w-full sm:w-40 text-right">
                      Birth Date
                    </label>
                    <div className="flex-1 grid grid-cols-3 gap-3">
                      <select
                        name="birthDate"
                        value={formData.birthDate}
                        onChange={handleInputChange}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      >
                        <option value="">Date</option>
                        {days.map(day => (
                          <option key={day} value={day}>{day}</option>
                        ))}
                      </select>
                      <select
                        name="birthMonth"
                        value={formData.birthMonth}
                        onChange={handleInputChange}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      >
                        <option value="">Month</option>
                        {months.map((month, index) => (
                          <option key={index} value={index + 1}>{month}</option>
                        ))}
                      </select>
                      <select
                        name="birthYear"
                        value={formData.birthYear}
                        onChange={handleInputChange}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      >
                        <option value="">Year</option>
                        {years.map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-4">
                    <div className="w-full sm:w-40"></div>
                    <div className="flex-1">
                      <button
                        type="submit"
                        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-12 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Column - Profile Picture */}
                <div className="lg:col-span-1 flex flex-col items-center justify-start pt-4">
                  <div className="relative">
                    {/* Profile Image */}
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center overflow-hidden shadow-lg">
                      {previewImage ? (
                        <img
                          src={previewImage}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <svg
                          className="w-20 h-20 text-gray-400"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                      )}
                    </div>
                  </div>

                  {/* Upload Button */}
                  <label className="mt-6 cursor-pointer">
                    <input
                      type="file"
                      accept="image/jpeg,image/png"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                    <span className="inline-block bg-white border-2 border-gray-300 hover:border-blue-500 text-gray-700 px-6 py-2 rounded-lg font-medium transition-all duration-200">
                      Choose Image
                    </span>
                  </label>

                  {/* Image Guidelines */}
                  <div className="mt-4 text-center text-sm text-gray-500 max-w-[200px]">
                    <p>File size: up to 1 MB</p>
                    <p>Supported formats: .JPEG, .PNG</p>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Address Management Section */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mt-8">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">My Addresses</h2>
                {addresses.length < 3 && (
                  <button
                    onClick={() => handleOpenAddressModal()}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add New Address
                  </button>
                )}
              </div>

              {addresses.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="text-lg font-medium mb-2">No addresses yet</p>
                  <p className="text-sm">Add addresses for shipping</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      className={`border-2 rounded-xl p-6 transition-all ${
                        address.is_default
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="inline-block px-3 py-1 bg-gray-200 text-gray-700 text-sm font-medium rounded">
                              {address.label}
                            </span>
                            {address.is_default && (
                              <span className="inline-block px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-medium rounded">
                                Default Address
                              </span>
                            )}
                          </div>
                          <p className="text-lg font-semibold text-gray-800 mb-1">{address.recipient_name}</p>
                          <p className="text-gray-600 mb-1">Phone: {address.phone_number}</p>
                          <p className="text-gray-700">
                            {address.address_line1}
                            {address.address_line2 && `, ${address.address_line2}`}
                          </p>
                          <p className="text-gray-700">
                            {address.district}, {address.sub_district}, {address.province} {address.postal_code}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2 ml-4">
                          <button
                            onClick={() => handleOpenAddressModal(address)}
                            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                            disabled={loading}
                          >
                            Edit
                          </button>
                          {!address.is_default && (
                            <button
                              onClick={() => handleSetDefaultAddress(address.id)}
                              className="text-green-600 hover:text-green-700 font-medium text-sm"
                              disabled={loading}
                            >
                              Set as Default
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteAddress(address.id)}
                            className="text-red-600 hover:text-red-700 font-medium text-sm"
                            disabled={loading}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {addresses.length >= 3 && (
                <p className="text-sm text-gray-500 mt-4 text-center">
                  You can add up to 3 addresses only
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-800">
                {editingAddress ? 'Edit Address' : 'Add New Address'}
              </h3>
              <button
                onClick={handleCloseAddressModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="p-8">
              <div className="space-y-6">
                {/* Label */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Address Type *</label>
                  <select
                    name="label"
                    value={addressForm.label}
                    onChange={handleAddressInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Home">Home</option>
                    <option value="Work">Work</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Recipient Name */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Recipient Name *</label>
                  <input
                    type="text"
                    name="recipient_name"
                    value={addressForm.recipient_name}
                    onChange={handleAddressInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone_number"
                    value={addressForm.phone_number}
                    onChange={handleAddressInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0812345678"
                  />
                </div>

                {/* Address Line 1 */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Address Line 1 *</label>
                  <input
                    type="text"
                    name="address_line1"
                    value={addressForm.address_line1}
                    onChange={handleAddressInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="House number, Street, Village"
                  />
                </div>

                {/* Address Line 2 */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Address Line 2</label>
                  <input
                    type="text"
                    name="address_line2"
                    value={addressForm.address_line2}
                    onChange={handleAddressInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Building, Floor, Room (if any)"
                  />
                </div>

                {/* District */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">District *</label>
                  <input
                    type="text"
                    name="district"
                    value={addressForm.district}
                    onChange={handleAddressInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="District"
                  />
                </div>

                {/* Sub District */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Sub District *</label>
                  <input
                    type="text"
                    name="sub_district"
                    value={addressForm.sub_district}
                    onChange={handleAddressInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Sub-district"
                  />
                </div>

                {/* Province and Postal Code */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Province *</label>
                    <input
                      type="text"
                      name="province"
                      value={addressForm.province}
                      onChange={handleAddressInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Province"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Postal Code *</label>
                    <input
                      type="text"
                      name="postal_code"
                      value={addressForm.postal_code}
                      onChange={handleAddressInputChange}
                      required
                      maxLength={5}
                      pattern="[0-9]{5}"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="10400"
                    />
                  </div>
                </div>

                {/* Set as Default */}
                {!editingAddress?.is_default && (
                  <div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="is_default"
                        checked={addressForm.is_default}
                        onChange={handleAddressInputChange}
                        className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500 rounded"
                      />
                      <span className="text-gray-700 font-medium">Set as Default Address</span>
                    </label>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-8">
                <button
                  type="button"
                  onClick={handleCloseAddressModal}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfilePage;
