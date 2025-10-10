import { useState } from "react";
import { toast } from "sonner";
import { ShieldCheck, CheckCircle, XCircle, Loader2, Info, FileText, Calendar, User, Award, Clock, Server } from "lucide-react";

interface CredentialForm {
  holderName: string;
  credentialType: string;
  issueDate: string;
  expiryDate: string;
}

interface VerificationResult {
  valid: boolean;
  message: string;
  workerId: string;
  timestamp: string;
  credentialDetails?: {
    id: string;
    issuedBy: string;
    issuedAt: string;
  };
}

const Verification = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [formData, setFormData] = useState<CredentialForm>({
    holderName: "",
    credentialType: "",
    issueDate: "",
    expiryDate: ""
  });

  const handleInputChange = (field: keyof CredentialForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      // Prepare credential data
      const credentialData: any = {
        holderName: formData.holderName.trim(),
        credentialType: formData.credentialType.trim()
      };

      if (formData.issueDate) {
        credentialData.issueDate = formData.issueDate;
      }

      if (formData.expiryDate) {
        credentialData.expiryDate = formData.expiryDate;
      }


      // Call verification API
      const API_URL = import.meta.env.VITE_VERIFICATION_API_URL || 'http://ec2-65-2-74-30.ap-south-1.compute.amazonaws.com/verification';
      const response = await fetch(`${API_URL}/api/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentialData)
      });

      const verificationResult = await response.json();
      setResult(verificationResult);

      if (verificationResult.valid) {
        toast.success("Credential Verified", {
          description: verificationResult.message,
          icon: <CheckCircle className="h-5 w-5" />
        });
      } else {
        toast.error("Verification Failed", {
          description: verificationResult.message,
          icon: <XCircle className="h-5 w-5" />
        });
      }
    } catch (error) {
      toast.error("Verification Error", {
        description: error instanceof Error ? error.message : "Network error",
        icon: <XCircle className="h-5 w-5" />
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 pt-8 animate-fadeInUp">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl blur-lg opacity-75 animate-pulse"></div>
              <div className="relative p-4 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-2xl">
                <ShieldCheck className="h-10 w-10 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold gradient-text">
            Credential Verification
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Verify the authenticity and validity of issued credentials with our secure verification system
          </p>
        </div>

        {/* Verification Form */}
        <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl overflow-hidden animate-slideInRight">
          {/* Header */}
          <div className="relative p-8 bg-gradient-to-r from-emerald-500 to-teal-600">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-teal-600/20"></div>
            <div className="relative text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-sm">
                  <ShieldCheck className="h-8 w-8 text-white" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Verify Credential</h2>
              <p className="text-emerald-100 text-lg">
                Enter credential details to verify its authenticity
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="p-8">
            <form onSubmit={handleVerify} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Holder Name */}
                <div className="space-y-3">
                  <label htmlFor="holderName" className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <User className="h-4 w-4 text-emerald-500" />
                    <span>Holder Name *</span>
                  </label>
                  <input
                    id="holderName"
                    placeholder="Enter full name"
                    value={formData.holderName}
                    onChange={(e) => handleInputChange('holderName', e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all duration-300"
                  />
                </div>

                {/* Credential Type */}
                <div className="space-y-3">
                  <label htmlFor="credentialType" className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <Award className="h-4 w-4 text-teal-500" />
                    <span>Credential Type *</span>
                  </label>
                  <input
                    id="credentialType"
                    placeholder="e.g., Certificate, License, Badge"
                    value={formData.credentialType}
                    onChange={(e) => handleInputChange('credentialType', e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20 transition-all duration-300"
                  />
                </div>

                {/* Issue Date */}
                <div className="space-y-3">
                  <label htmlFor="issueDate" className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <Calendar className="h-4 w-4 text-green-500" />
                    <span>Issue Date (Optional)</span>
                  </label>
                  <input
                    id="issueDate"
                    type="date"
                    value={formData.issueDate}
                    onChange={(e) => handleInputChange('issueDate', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all duration-300"
                  />
                </div>

                {/* Expiry Date */}
                <div className="space-y-3">
                  <label htmlFor="expiryDate" className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <Calendar className="h-4 w-4 text-orange-500" />
                    <span>Expiry Date (Optional)</span>
                  </label>
                  <input
                    id="expiryDate"
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all duration-300"
                  />
                </div>
              </div>


              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full relative px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-700 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center space-x-3">
                  {loading ? (
                    <>
                      <Loader2 className="h-6 w-6 animate-spin" />
                      <span className="font-semibold text-lg">Verifying...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-6 w-6" />
                      <span className="font-semibold text-lg">Verify Credential</span>
                    </>
                  )}
                </div>
              </button>
            </form>
          </div>
        </div>

        {/* Verification Result */}
        {result && (
          <div className={`relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl border-2 shadow-2xl overflow-hidden animate-fadeInUp ${
            result.valid 
              ? 'border-emerald-200 dark:border-emerald-700 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 dark:from-emerald-900/20 dark:to-teal-900/20' 
              : 'border-red-200 dark:border-red-700 bg-gradient-to-br from-red-50/50 to-pink-50/50 dark:from-red-900/20 dark:to-pink-900/20'
          }`}>
            {/* Header */}
            <div className={`relative p-6 ${result.valid ? 'bg-gradient-to-r from-emerald-500 to-teal-600' : 'bg-gradient-to-r from-red-500 to-pink-600'}`}>
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5"></div>
              <div className="relative flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-sm">
                  {result.valid ? (
                    <CheckCircle className="h-8 w-8 text-white" />
                  ) : (
                    <XCircle className="h-8 w-8 text-white" />
                  )}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    {result.valid ? 'Credential Valid ✓' : 'Credential Invalid ✗'}
                  </h3>
                  <p className="text-white/90">{result.message}</p>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Server className="h-4 w-4 text-gray-500" />
                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Verified By</p>
                  </div>
                  <p className="font-mono text-sm bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg">
                    {result.workerId}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Verified At</p>
                  </div>
                  <p className="font-mono text-sm bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg">
                    {new Date(result.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>

              {result.credentialDetails && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h4 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                    <Award className="h-5 w-5 text-emerald-500" />
                    Credential Details
                  </h4>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Credential ID</p>
                      </div>
                      <p className="font-mono text-sm bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg break-all">
                        {result.credentialDetails.id}
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Issued By</p>
                        </div>
                        <p className="font-mono text-sm bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg">
                          {result.credentialDetails.issuedBy}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Issued At</p>
                        </div>
                        <p className="font-mono text-sm bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg">
                          {new Date(result.credentialDetails.issuedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Info Card */}
        <div className="relative bg-gradient-to-r from-emerald-500/10 to-teal-500/10 backdrop-blur-sm rounded-3xl border border-emerald-200/50 dark:border-emerald-700/50 p-8 animate-fadeInUp">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg">
              <Info className="h-6 w-6 text-white" />
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">Verification Process</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                The verification service checks the credential against the issuance database using SHA-256 hashing
                and returns the worker ID that processed the verification along with the original issuance details.
                Each verification attempt is logged for audit purposes and duplicate detection.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verification;
