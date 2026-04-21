import React, { useEffect, useState, useCallback } from "react";
import { IoAdd, IoSearch } from "react-icons/io5";
import { LuLoader } from "react-icons/lu";
import Axios from "../../utils/Axios";
import SummaryApi from "../../common/SummaryApi";
import AxiosToastError from "../../utils/AxiosToastError";
import AddLoan from "./actions/AddLoan";
import toast from "react-hot-toast";

function Customers() {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const clientsPerPage = 10;

  const [showAddLoan, setShowAddLoan] = useState(false);

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showEditCustomer, setShowEditCustomer] = useState(false);

  // =========================
  // FETCH CLIENTS
  // =========================
  const fetchClients = useCallback(async () => {
    try {
      setLoading(true);

      const response = await Axios({
        ...SummaryApi.myClients,
      });

      if (response.data.success) {
        const data = response.data.data.clients || [];
        setClients(data);
        setFilteredClients(data);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  // =========================
  // SEARCH FILTER
  // =========================
  useEffect(() => {
    const filtered = clients.filter((client) => {
      const name = client?.name?.toLowerCase() || "";
      const phone = client?.phone || "";
      const id = client?.nationalId || "";

      return (
        name.includes(search.toLowerCase()) ||
        phone.includes(search) ||
        id.includes(search)
      );
    });

    setFilteredClients(filtered);
    setCurrentPage(1);
  }, [search, clients]);

  // =========================
  // DELETE CLIENT (SAFETY)
  // =========================
  const handleDelete = async (id) => {
    try {
      const confirm = window.confirm("Are you sure you want to delete?");
      if (!confirm) return;

      const response = await Axios({
        ...SummaryApi.deleteClient,
        data: { id },
      });

      if (response.data.success) {
        toast.success("Client deleted");

        const updated = clients.filter((c) => c._id !== id);
        setClients(updated);
        setFilteredClients(updated);
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  // =========================
  // PAGINATION
  // =========================
  const indexOfLast = currentPage * clientsPerPage;
  const indexOfFirst = indexOfLast - clientsPerPage;
  const currentClients = filteredClients.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredClients.length / clientsPerPage);

return (
  <section className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">
    
    <div className="max-w-7xl mx-auto px-4 py-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Customers
          </h2>
          <p className="text-gray-400 text-sm">
            Manage clients, loans and account activity
          </p>
        </div>

        <button
          onClick={() => setShowAddLoan(true)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 
          bg-gradient-to-r from-blue-600 to-blue-500 
          hover:from-blue-500 hover:to-blue-400
          rounded-xl text-sm font-medium shadow-lg transition"
        >
          <IoAdd />
          Apply Loan
        </button>

      </div>

      {/* SEARCH */}
      <div className="relative mb-6">
        <IoSearch className="absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, phone or ID..."
          className="w-full pl-10 pr-4 py-3 
          bg-gray-900 border border-gray-800 
          rounded-xl text-sm text-white
          placeholder-gray-500
          focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="flex justify-center py-16">
          <LuLoader className="animate-spin text-2xl text-blue-500" />
        </div>
      ) : (
        <>
          {/* TABLE WRAPPER */}
          <div className="overflow-x-auto rounded-2xl border border-gray-800 shadow-xl">

            <table className="w-full text-sm">

              {/* HEADER */}
              <thead className="bg-gray-900 text-gray-300 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-4 text-left">#</th>
                  <th className="px-5 py-4 text-left">Name</th>
                  <th className="px-5 py-4">Phone</th>
                  <th className="px-5 py-4">Email</th>
                  <th className="px-5 py-4">National ID</th>
                  <th className="px-5 py-4">Joined</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>

              {/* BODY */}
              <tbody className="divide-y divide-gray-800">

                {currentClients.map((client,index) => (
                  <tr
                    key={client._id}
                    className="hover:bg-gray-800/60 transition"
                  >
                    <td className="px-5 py-4 font-medium">
                      {index+1}
                    </td>

                    <td className="px-5 py-4 font-medium">
                      {client.name}
                    </td>

                    <td className="px-5 py-4 text-gray-300">
                      {client.phone}
                    </td>

                    <td className="px-5 py-4 text-gray-400">
                      {client.email || "-"}
                    </td>

                    <td className="px-5 py-4 text-gray-400">
                      {client.nationalId}
                    </td>

                    <td className="px-5 py-4 text-gray-400">
                      {new Date(client.createdAt).toLocaleDateString()}
                    </td>

                    {/* ACTIONS */}
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">

                        <button
                          onClick={() => {
                            setSelectedCustomer(client);
                            setShowEditCustomer(true);
                          }}
                          className="px-3 py-1.5 text-xs rounded-lg 
                          bg-blue-600/20 text-blue-400 
                          hover:bg-blue-600 hover:text-white 
                          transition"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(client._id)}
                          className="px-3 py-1.5 text-xs rounded-lg 
                          bg-red-600/20 text-red-400 
                          hover:bg-red-600 hover:text-white 
                          transition"
                        >
                          Delete
                        </button>

                      </div>
                    </td>

                  </tr>
                ))}

              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="flex justify-between items-center mt-6 text-sm">

            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg bg-gray-900 
              border border-gray-800 hover:bg-gray-800 
              disabled:opacity-40"
            >
              Prev
            </button>

            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-9 h-9 rounded-lg text-sm transition ${
                    currentPage === i + 1
                      ? "bg-blue-600 text-white"
                      : "bg-gray-900 border border-gray-800 text-gray-300 hover:bg-gray-800"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() =>
                setCurrentPage(p => Math.min(p + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg bg-gray-900 
              border border-gray-800 hover:bg-gray-800 
              disabled:opacity-40"
            >
              Next
            </button>

          </div>
        </>
      )}

    </div>

    {/* MODAL */}
    {showAddLoan && (
      <AddLoan
        close={() => setShowAddLoan(false)}
        fetch={fetchClients}
      />
    )}

  </section>
);
}

export default Customers;