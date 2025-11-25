"use client";
import React, { useEffect, useState } from "react";
import VendorList from "./VendorList";
import { Vendor } from "../_lib/type";
import { getVendors } from "../_lib/vendors";
import ProtectedRoute from "../_components/ProtectedRoute";

export default function Page() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([]);

  // FILTER STATES
  const [search, setSearch] = useState<string>("");
  const [businessType, setBusinessType] = useState<string>("Any");
  const [kyc, setKyc] = useState<string>("Any");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchVendors = async () => {
      setLoading(true);
      const res = await getVendors();
      if (res?.success) {
        const apiVendors: Vendor[] = res.data.data;
        setVendors(apiVendors);
        setFilteredVendors(apiVendors);
      }
      setLoading(false)
    };
    fetchVendors();
  }, []);

  // FILTERING LOGIC
 const handleApplyFilters = () => {
  let data = [...vendors];

  // Search
  if (search.trim()) {
    const lower = search.toLowerCase();
    data = data.filter(
      v =>
        v.business_name.toLowerCase().includes(lower) ||
        v.contact_person_name.toLowerCase().includes(lower) ||
        v.email.toLowerCase().includes(lower)
    );
  }

  // Business type
  if (businessType !== "Any") {
    data = data.filter(v => v.kyc_compliance.business_type === businessType);
  }

  // KYC status
  if (kyc !== "Any") {
    data = data.filter(v => {
      const isVerified =
        v.is_business_verified &&
        v.is_identity_verified &&
        v.is_bank_information_verified;

      if (kyc === "Verified") return isVerified;
      if (kyc === "Unverified") return !isVerified;
      if (kyc === "Pending") {
        return (
          !v.is_business_verified ||
          !v.is_identity_verified ||
          !v.is_bank_information_verified
        );
      }
      return true;
    });
  }

  setFilteredVendors(data);
};


  return (
    <ProtectedRoute>
      <section className="bg-white min-h-screen px-4 md:px-8 py-6 w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-black font-bold text-xl">Vendor List</h1>

        <div className="flex gap-3 items-center">
          <button className="border border-black text-black py-[5px] px-2.5 text-xs">
            Invite Vendor
          </button>
          <button className="border border-black text-black py-[5px] px-2.5 text-xs">
            Export CSV
          </button>
          <button className="border border-black text-black py-[5px] px-2.5 text-xs">
            Help
          </button>
        </div>
      </div>

      <VendorList
        vendors={filteredVendors}
        search={search}
        setSearch={setSearch}
        businessType={businessType}
        setBusinessType={setBusinessType}
        kyc={kyc}
        setKyc={setKyc}
         loading={loading} 
          onApplyFilters={handleApplyFilters}
      />
    </section>
    </ProtectedRoute>
  );
}
