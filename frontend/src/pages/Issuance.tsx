import { useState } from "react";

import { toast } from "sonner";
import { Shield, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

interface CredentialForm {
  holderName: string;
  credentialType: string;
  issueDate: string;
  expiryDate: string;
  additionalData: string;
}

const Issuance = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CredentialForm>({
    holderName: "",
    credentialType: "",
    issueDate: new Date().toISOString().split('T')[0],
    expiryDate: "",
    additionalData: ""
  });

  const handleInputChange = (field: keyof CredentialForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare credential data
      const credentialData: any = {
        holderName: formData.holderName.trim(),
        credentialType: formData.credentialType.trim(),
        issueDate: formData.issueDate
      };

      if (formData.expiryDate) {
        credentialData.expiryDate = formData.expiryDate;
      }

      if (formData.additionalData.trim()) {
        try {
          credentialData.data = JSON.parse(formData.additionalData);
        } catch {
          credentialData.data = { notes: formData.additionalData };
        }
      }

      // Call issuance API
      const API_URL = import.meta.env.VITE_ISSUANCE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${API_URL}/issue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentialData)
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
          issueDate: new Date().toISOString().split('T')[0],
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
    <div className="min-h-screen  p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 pt-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-primary to-primary-glow shadow-lg">
              <Shield className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Credential Issuance
          </h1>
          <p className="text-indigo-200 text-lg">
            Issue verifiable credentials securely
          </p>
        </div>

        {/* Issuance Form */}
        <div className="shadow-lg  w-full h-full bg-yellow-100 p-3 border-2 border-indigo-300 
        rounded-md ">
          <div className="">
            <div className="">Issue New Credential</div>
            <div className="">
              Fill in the details below to issue a new verifiable credential
            </div>
          </div>
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col gap-4">
                <div className="space-y-2">
                  <label htmlFor="holderName">Holder Name *</label>
                  <input
                    id="holderName"
                    placeholder="John Doe"
                    value={formData.holderName}
                    onChange={(e) => handleInputChange('holderName', e.target.value)}
                    required
                    className="border-2 border-indigo-200 p-1"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="credentialType">Credential Type *</label>
                  <input
                    id="credentialType"
                    placeholder="Certificate, License, Badge, etc."
                    value={formData.credentialType}
                    onChange={(e) => handleInputChange('credentialType', e.target.value)}
                    required
                    className="border-2 border-indigo-200 p-1"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="issueDate">Issue Date *</label>
                  <input
                    id="issueDate"
                    type="date"
                    value={formData.issueDate}
                    onChange={(e) => handleInputChange('issueDate', e.target.value)}
                    required
                    className="border-border/50"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="expiryDate">Expiry Date (Optional)</label>
                  <input
                    id="expiryDate"
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                    className="border-border/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="additionalData">Additional Data (Optional JSON)</label>
                <textarea
                  id="additionalData"
                  placeholder='{"score": 95, "institution": "XYZ University"}'
                  value={formData.additionalData}
                  onChange={(e) => handleInputChange('additionalData', e.target.value)}
                  className="w-full min-h-[100px] px-3 py-2 rounded-md border border-border/50 bg-background text-foreground resize-y focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-300
                 to-indigo-600 p-2 rounded-xl text-white shadow-md"
              >
                {loading ? (
                  <>
                    <Loader2 className=" h-5 w-5 animate-spin" />
                    Issuing Credential...
                  </>
                ) : (
                  <>
                    <Shield className="mx-auto h-5 w-5" />
                    Issue Credential
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Info Card */}
        <div className="border-accent/20 bg-accent/5">
          <div className="pt-6">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-accent/10">
                <Shield className="h-5 w-5 text-accent" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-foreground">How it works</h3>
                <p className="text-sm text-muted-foreground">
                  Each credential is issued with a unique hash and tracked by the worker pod that processed it.
                  Duplicate credentials are automatically detected and rejected.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Issuance;
