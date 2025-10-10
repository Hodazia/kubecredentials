// 

import { useState } from "react";
import { toast } from "sonner";
import { Shield, CheckCircle, AlertCircle, Loader2, FileText, Calendar, User, Award, Code2 } from "lucide-react";

interface CredentialForm {
  holderName: string;
  credentialType: string;
  issueDate: string;
  expiryDate: string;
  additionalData: string; // JSON string input
}

const Issuance = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CredentialForm>({
    holderName: "",
    credentialType: "",
    issueDate: new Date().toISOString().split("T")[0],
    expiryDate: "",
    additionalData: ""
  });

  const handleInputChange = (field: keyof CredentialForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Parse optional JSON data
      let additionalJson: Record<string, any> = {};
      if (formData.additionalData.trim()) {
        try {
          additionalJson = JSON.parse(formData.additionalData.trim());
        } catch (err) {
          throw new Error("Invalid JSON format in Additional Data field");
        }
      }

      // Combine structured + JSON data
      const credentialData: Record<string, any> = {
        holderName: formData.holderName.trim(),
        credentialType: formData.credentialType.trim(),
        issueDate: formData.issueDate
      };

      if (formData.expiryDate) {
        credentialData.expiryDate = formData.expiryDate;
      }

      // Merge any custom fields
      const finalPayload = { ...credentialData, ...additionalJson };

      // POST to backend
      const API_URL = import.meta.env.VITE_ISSUANCE_API_URL || "https://issuance.zia-hoda.org";
      const response = await fetch(`${API_URL}/issue`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalPayload)
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message, {
          description: `Credential ID: ${result.credential.id}`,
          icon: <CheckCircle className="h-5 w-5" />
        });

        // Reset form
        setFormData({
          holderName: "",
          credentialType: "",
          issueDate: new Date().toISOString().split("T")[0],
          expiryDate: "",
          additionalData: ""
        });
      } else {
        toast.error(result.message, {
          description: `Handled by ${result.workerId}`,
          icon: <AlertCircle className="h-5 w-5" />
        });
      }
    } catch (error) {
      toast.error("Failed to issue credential", {
        description: error instanceof Error ? error.message : "Network error",
        icon: <AlertCircle className="h-5 w-5" />
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 pt-8 animate-fadeInUp">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur-lg opacity-75 animate-pulse"></div>
              <div className="relative p-4 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-2xl">
                <Shield className="h-10 w-10 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold gradient-text">Credential Issuance</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Issue verifiable credentials securely with both fixed and custom data.
          </p>
        </div>

        {/* Form */}
        <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl overflow-hidden animate-slideInRight">
          <div className="relative p-8 bg-gradient-to-r from-blue-500 to-purple-600 text-center">
            <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-sm inline-block mb-3">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Issue New Credential</h2>
            <p className="text-blue-100 text-lg">Fill in the fields and optional JSON data below</p>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Structured Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Holder Name */}
                <div className="space-y-3">
                  <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <User className="h-4 w-4 text-blue-500" />
                    <span>Holder Name *</span>
                  </label>
                  <input
                    value={formData.holderName}
                    onChange={(e) => handleInputChange("holderName", e.target.value)}
                    placeholder="Enter full name"
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700"
                  />
                </div>

                {/* Credential Type */}
                <div className="space-y-3">
                  <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <Award className="h-4 w-4 text-purple-500" />
                    <span>Credential Type *</span>
                  </label>
                  <input
                    value={formData.credentialType}
                    onChange={(e) => handleInputChange("credentialType", e.target.value)}
                    placeholder="Certificate, License, etc."
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700"
                  />
                </div>

                {/* Issue Date */}
                <div className="space-y-3">
                  <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <Calendar className="h-4 w-4 text-green-500" />
                    <span>Issue Date *</span>
                  </label>
                  <input
                    type="date"
                    value={formData.issueDate}
                    onChange={(e) => handleInputChange("issueDate", e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700"
                  />
                </div>

                {/* Expiry Date */}
                <div className="space-y-3">
                  <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <Calendar className="h-4 w-4 text-orange-500" />
                    <span>Expiry Date (Optional)</span>
                  </label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700"
                  />
                </div>
              </div>

              {/* JSON Additional Data */}
              <div className="space-y-3">
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <Code2 className="h-4 w-4 text-indigo-500" />
                  <span>Additional JSON Data (Optional)</span>
                </label>
                <textarea
                  rows={6}
                  value={formData.additionalData}
                  onChange={(e) => handleInputChange("additionalData", e.target.value)}
                  placeholder='{\n  "email": "john@example.com",\n  "organization": "ACME Corp"\n}'
                  className="w-full font-mono text-sm px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Must be valid JSON. Example: {"{ \"email\": \"user@example.com\", \"role\": \"admin\" }"}
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full relative px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50"
              >
                <div className="relative flex items-center justify-center space-x-3">
                  {loading ? (
                    <>
                      <Loader2 className="h-6 w-6 animate-spin" />
                      <span className="font-semibold text-lg">Issuing Credential...</span>
                    </>
                  ) : (
                    <>
                      <Shield className="h-6 w-6" />
                      <span className="font-semibold text-lg">Issue Credential</span>
                    </>
                  )}
                </div>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Issuance;
