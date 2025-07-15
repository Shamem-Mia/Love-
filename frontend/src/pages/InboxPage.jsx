import React, { useState, useEffect } from "react";
import { Filter, Search, RefreshCw, Trash2 } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import { axiosInstance } from "../context/axiosInstance.js";
import { useAuthStore } from "../stores/useAuthStore.js";

const InboxPage = () => {
  const { authUser } = useAuthStore();

  const [calculations, setCalculations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState({
    field: "",
    value: "",
  });
  const [queryResults, setQueryResults] = useState([]);

  useEffect(() => {
    fetchCalculations();
  }, []);

  const fetchCalculations = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/users/inbox");
      setCalculations(response.data.calculations);
      setQueryResults(response.data.calculations);
      toast.success("History loaded successfully!");
    } catch (error) {
      console.error("Error fetching calculations:", error);
      toast.error(error.response?.data?.message || "Failed to load history");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCalculation = async (calculationId) => {
    try {
      await axiosInstance.delete(`/users/inbox/${calculationId}`);
      // Remove the deleted calculation from state
      setCalculations(
        calculations.filter((calc) => calc._id !== calculationId)
      );
      setQueryResults(
        queryResults.filter((calc) => calc._id !== calculationId)
      );
      toast.success("Calculation deleted successfully!");
    } catch (error) {
      console.error("Error deleting calculation:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete calculation"
      );
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilter = () => {
    if (!filter.field || !filter.value) {
      setQueryResults(calculations);
      return;
    }

    const filtered = calculations.filter((calc) =>
      String(calc[filter.field])
        .toLowerCase()
        .includes(filter.value.toLowerCase())
    );
    setQueryResults(filtered);
  };

  const resetFilter = () => {
    setFilter({ field: "", value: "" });
    setQueryResults(calculations);
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-pink-50 py-12 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-blue-500 mb-2">
            Your ID PIN {authUser.idPin}
          </h1>
          <h1 className="text-4xl text-pink-600 font-bold  mb-2">
            Love Calculation History
          </h1>
          <p className="text-lg text-pink-800">
            View love percentages given by your link and idPin
          </p>
        </div>

        {/* Results Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-pink-600">
              Query Results
            </h2>
            <div className="text-sm text-gray-500">
              {queryResults.length} of {calculations.length} results
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500 mx-auto"></div>
              <p className="mt-2 text-pink-600">Loading calculations...</p>
            </div>
          ) : queryResults.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No calculations found. Try adjusting your filters.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Crush Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Love %
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID Pin
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {queryResults.map((calc) => (
                    <tr key={calc._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {calc.yourName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {calc.yourAge} yrs, {calc.yourEducation}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {calc.crushName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {calc.crushAge} yrs, {calc.crushEducation}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-16 h-4 bg-gray-200 rounded-full mr-2">
                            <div
                              className="h-full bg-pink-600 rounded-full"
                              style={{ width: `${calc.lovePercentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {calc.lovePercentage}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(calc.calculatedAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {calc.idPin}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleDeleteCalculation(calc._id)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InboxPage;
