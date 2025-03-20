import React, { useState } from "react";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";

const RegisterCompany: React.FC = () => {
  const router = useRouter();
  const [companyName, setCompanyName] = useState("");
  const [budget, setBudget] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("/api/register-company", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyName,
          budget,
          logoUrl,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to register company");
      }

      toast.success("Company profile created successfully!");
      // Add a small delay before redirecting
      setTimeout(() => {
        router.push("/profile");
      }, 1500);
    } catch (error) {
      console.error("Error registering company:", error);
      toast.error("Failed to register company. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Render your form here */}
    </div>
  );
};

export default RegisterCompany;