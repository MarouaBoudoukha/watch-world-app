import { useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';

export default function CompanyRegistrationForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    budget: '',
    logo: null as File | null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('companyName', formData.companyName);
      formDataToSend.append('budget', formData.budget);
      if (formData.logo) {
        formDataToSend.append('logo', formData.logo);
      }

      const response = await fetch('/api/register-company', {
        method: 'POST',
        body: formDataToSend,
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to register company');
      }

      toast.success('Company registered successfully!');
      router.push('/');
    } catch (error) {
      console.error('Error registering company:', error);
      toast.error('Failed to register company. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, logo: e.target.files![0] }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex flex-col items-center justify-center p-8">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Register Your Company</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-300">
              Company Name
            </label>
            <input
              type="text"
              id="companyName"
              required
              placeholder="Enter your company name"
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
              value={formData.companyName}
              onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
            />
          </div>

          <div>
            <label htmlFor="budget" className="block text-sm font-medium text-gray-300">
              Initial Budget (WLD)
            </label>
            <input
              type="number"
              id="budget"
              required
              min="0"
              step="0.01"
              placeholder="Enter your initial budget"
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
              value={formData.budget}
              onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
            />
          </div>

          <div>
            <label htmlFor="logo" className="block text-sm font-medium text-gray-300">
              Company Logo
            </label>
            <input
              type="file"
              id="logo"
              accept="image/*"
              className="mt-1 block w-full text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-500 file:text-white hover:file:bg-blue-600"
              onChange={handleLogoChange}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Registering...' : 'Register Company'}
          </button>
        </form>
      </div>
    </div>
  );
}